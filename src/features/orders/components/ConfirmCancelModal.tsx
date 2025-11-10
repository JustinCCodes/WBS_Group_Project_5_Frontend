import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ConfirmCancelModalProps } from "../types";

export function ConfirmCancelModal({
  isOpen,
  orderId,
  isCancelling,
  onConfirm,
  onCancel,
}: ConfirmCancelModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCancelling) {
        onCancel();
      }
    };

    // Focus confirm button when modal opens
    confirmButtonRef.current?.focus();

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isCancelling, onCancel]);

  if (!isOpen || !orderId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={(e) => {
        // Closes on backdrop click
        if (e.target === e.currentTarget && !isCancelling) {
          onCancel();
        }
      }}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-red-900/20 border border-red-800 rounded-lg flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h3 id="modal-title" className="text-xl font-bold text-white mb-1">
              Cancel Order?
            </h3>
            <p className="text-sm text-gray-400">
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <p id="modal-description" className="text-gray-300 mb-6">
          Are you sure you want to cancel this order? This action cannot be
          undone. Stock for these items will be restored.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className={`flex-1 px-4 py-3 rounded-lg transition-all font-semibold bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50`}
          >
            Go Back
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isCancelling}
            className={`flex-1 px-4 py-3 rounded-lg transition-all font-semibold bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50 disabled:opacity-50`}
          >
            {isCancelling ? (
              <span className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Cancelling...
              </span>
            ) : (
              "Cancel Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
