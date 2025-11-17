import { OrderSummaryHeaderProps, OrderStatusBadge } from "../index";

// Component to display order summary header
export function OrderSummaryHeader({ order }: OrderSummaryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <OrderStatusBadge status={order.status} />
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-400">
            Placed on{" "}
            <time dateTime={order.createdAt}>
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0">
        <span className="text-sm text-gray-400 sm:mb-1">TOTAL</span>
        <span className="text-xl font-bold text-amber-400">
          ${order.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
