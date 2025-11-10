import Link from "next/link";
import { FileDown, Info, XCircle } from "lucide-react";
import { OrderActionsProps } from "../types";

// Component for order actions
export function OrderActions({
  order,
  isCancelling,
  onCancel,
  onDownloadBill,
}: OrderActionsProps) {
  const canCancel = order.status === "pending";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 justify-between w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* View Details */}
        <Link
          href={`/orders/${order.id}`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-transform"
        >
          <Info className="w-5 h-5" />
          Order Details
        </Link>

        {/* Secondary Actions */}
        <button
          onClick={onDownloadBill}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Download Bill
        </button>
      </div>

      {/* Cancel Action */}
      {canCancel && (
        <button
          onClick={onCancel}
          disabled={isCancelling}
          aria-label="Cancel order"
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all font-semibold bg-red-900/20 border border-red-800 text-red-400 hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-auto`}
        >
          {isCancelling ? (
            <>
              <div
                className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              Cancelling...
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" aria-hidden="true" />
              Cancel Order
            </>
          )}
        </button>
      )}
    </div>
  );
}
