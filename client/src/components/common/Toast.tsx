import type { JSX } from 'react';
import '@/components/common/Toast.css';

interface ToastProps {
  text: string;
}

export const Toast = ({ text }: ToastProps): JSX.Element => {
  return (
    <div className={text ? 'toast show' : 'toast'} role="status" aria-live="polite">
      {text}
    </div>
  );
};
