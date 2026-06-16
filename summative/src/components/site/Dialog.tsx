import { FaTimes } from 'react-icons/fa';
import type { ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
}

export default function Dialog({
  isOpen,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-4">{children}</div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-850">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="px-4 py-2 rounded-lg bg-tmdb-light text-white hover:bg-blue-600 transition text-sm font-medium disabled:opacity-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
