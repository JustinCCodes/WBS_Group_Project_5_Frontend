import { OrderItem, OrderProductListProps } from "../index";

// Component to display list of order products
export function OrderProductList({ products }: OrderProductListProps) {
  const [visibleProducts, otherProductsCount] =
    products.length > 3
      ? [products.slice(0, 3), products.length - 3]
      : [products, 0];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Order Items
      </h4>
      <div className="space-y-3">
        {visibleProducts.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}
      </div>
      {otherProductsCount > 0 && (
        <div className="text-center text-sm text-gray-400 pt-2">
          + {otherProductsCount} more{" "}
          {otherProductsCount === 1 ? "item" : "items"}
        </div>
      )}
    </div>
  );
}
