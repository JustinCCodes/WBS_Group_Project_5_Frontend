"use client";
import { XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ConfirmCancelModalProps } from "../index";

// ConfirmCancelModal component
export function ConfirmCancelModal({
  isOpen,
  orderId,
  isCancelling,
  onConfirm,
  onCancel,
}: ConfirmCancelModalProps) {
  // Focus confirm button when modal opens
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCancelling) {
        onCancel();
      }
    };

    confirmButtonRef.current?.focus();

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isCancelling, onCancel]);

  if (!isOpen || !orderId) return null;

  // RGB animated border wrapper styles
  const rgbBorderWrapper = `relative w-full max-w-md
    rounded-2xl p-0.5 overflow-hidden
    [background:linear-gradient(90deg,rgba(239,68,68,0.5),rgba(234,179,8,0.5),rgba(34,197,94,0.5),rgba(59,130,246,0.5),rgba(168,85,247,0.5),rgba(239,68,68,0.5))]
    bg-size-[300%_300%] animate-[rgb-border_3s_ease_infinite]`;

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
      {/* RGB Animated Wrapper */}
      <div className={rgbBorderWrapper}>
        {/* Modal Inner Content */}
        <div className="bg-zinc-950 rounded-[calc(1rem-2px)] shadow-2xl w-full p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <XCircle
              className="w-8 h-8 text-red-500 shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3
                id="modal-title"
                className="text-2xl font-bold text-white mb-0"
              >
                Cancel Order?
              </h3>
              <p className="text-sm text-gray-400">
                Order #{orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Description */}
          <p id="modal-description" className="text-gray-300 mb-8">
            Are you sure you want to cancel this order? This action cannot be
            undone. Stock for these items will be restored.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className={`flex-1 px-2 py-1 rounded-lg transition-all font-semibold
                bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Go Back
            </button>
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              disabled={isCancelling}
              className={`flex-1 px-2 py-1 rounded-lg transition-all font-bold
                bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:bg-red-800 disabled:text-red-300`}
            >
              {isCancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Cancelling...
                </span>
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
