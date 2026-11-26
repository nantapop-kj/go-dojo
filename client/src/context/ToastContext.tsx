import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { Toast } from '@/components/common/Toast';
import { ToastDuration } from '@/constants/defaults';

export type ShowToast = (text: string) => void;

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastContext = createContext<ShowToast | null>(null);

export const ToastProvider = ({ children }: ToastProviderProps): JSX.Element => {
  const [text, setText] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((nextText: string): void => {
    setText(nextText);

    clearTimeout(timer.current);
    timer.current = setTimeout((): void => setText(''), ToastDuration);
  }, []);

  useEffect((): (() => void) => {
    return (): void => clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast text={text} />
    </ToastContext.Provider>
  );
};
