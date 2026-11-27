import type { Board, BotConfig, BotDecision, Color, Estimate } from '@/lib/go';
import type { WorkerRequest, WorkerResponse } from '@/types';

interface PendingRequest {
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
}

type RequestKind = WorkerRequest['kind'];
type RequestPayload<Kind extends RequestKind> = Omit<
  Extract<WorkerRequest, { kind: Kind }>,
  'id' | 'kind'
>;

export class BotWorkerClient {
  private worker: Worker | null = null;
  private sequence = 0;
  private pending = new Map<number, PendingRequest>();

  move = (board: Board, color: Color, config: BotConfig): Promise<BotDecision> => {
    return this.call<'move', BotDecision>('move', { snapshot: board.snapshot(), color, config });
  };

  estimate = (board: Board, count: number, komi: number): Promise<Estimate> => {
    return this.call<'estimate', Estimate>('estimate', { snapshot: board.snapshot(), count, komi });
  };

  private getWorker = (): Worker => {
    if (this.worker) return this.worker;

    const worker = new Worker(new URL('../../workers/bot.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = this.handleMessage;
    this.worker = worker;

    return worker;
  };

  private handleMessage = (event: MessageEvent<WorkerResponse>): void => {
    const { id, result, error } = event.data;
    const request = this.pending.get(id);

    if (!request) return;

    this.pending.delete(id);

    if (error) {
      request.reject(new Error(error));
    } else {
      request.resolve(result);
    }
  };

  private call = <Kind extends RequestKind, Result>(
    kind: Kind,
    payload: RequestPayload<Kind>,
  ): Promise<Result> => {
    const id = ++this.sequence;
    const worker = this.getWorker();

    return new Promise<Result>((resolve, reject): void => {
      this.pending.set(id, { resolve: resolve as (result: unknown) => void, reject });
      worker.postMessage({ id, kind, ...payload });
    });
  };
}
