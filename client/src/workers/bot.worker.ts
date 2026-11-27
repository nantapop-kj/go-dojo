import { Board, botMove, estimate } from '@/lib/go';
import type { WorkerRequest, WorkerResponse } from '@/types';

const respond = (response: WorkerResponse, transfer: Transferable[] = []): void => {
  self.postMessage(response, { transfer });
};

self.onmessage = (event: MessageEvent<WorkerRequest>): void => {
  const request = event.data;

  try {
    const board = Board.fromSnapshot(request.snapshot);

    if (request.kind === 'move') {
      respond({ id: request.id, result: botMove(board, request.color, request.config) });
      return;
    }

    const result = estimate(board, request.count, request.komi);

    respond({ id: request.id, result }, [result.ownership.buffer]);
  } catch (error) {
    respond({ id: request.id, error: String(error) });
  }
};
