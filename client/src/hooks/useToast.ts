import { useContext } from 'react';
import { ToastContext, type ShowToast } from '@/context/ToastContext';

export const useToast = (): ShowToast => {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }

  return showToast;
};
