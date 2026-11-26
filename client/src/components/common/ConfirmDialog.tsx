import type { JSX } from 'react';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import '@/components/common/ConfirmDialog.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps): JSX.Element => {
  const handleConfirm = (): void => {
    onClose();
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="confirm-title">
      <h2 id="confirm-title">{title}</h2>
      <p className="confirm-body">{body}</p>

      <div className="modal-actions">
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button
          variant="primary"
          className={danger ? 'confirm-danger' : undefined}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
};
