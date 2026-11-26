import { useEffect, useRef, type JSX, type MouseEvent, type ReactNode } from 'react';
import '@/components/common/Dialog.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

export const Dialog = ({ open, onClose, labelledBy, children }: DialogProps): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect((): void => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={handleClick}
    >
      {open && children}
    </dialog>
  );
};
