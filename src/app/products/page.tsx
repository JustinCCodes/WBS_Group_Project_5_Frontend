import { Suspense } from "react";
import ProductList from "@/features/products/components/ProductList";
import {
  getCategoriesServer,
  getProductsServer,
} from "@/features/products/data.server";

export default async function ProductPage() {
  // Fetches first page of products and categories on server
  const [productsData, categories] = await Promise.all([
    getProductsServer({ page: 1, limit: 12 }),
    getCategoriesServer(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList
        initialProducts={productsData.data}
        initialTotalPages={productsData.pagination.totalPages}
        categories={categories}
      />
    </Suspense>
  );
}
