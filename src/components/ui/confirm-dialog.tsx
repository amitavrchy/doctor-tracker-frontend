"use client";

import { Button } from "./button";
import { Modal } from "./dialog";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  loading,
  confirmLabel = "Confirm",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
  confirmLabel?: string;
}) {
  return (
    <Modal {...{ open, onClose, title }}>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
