import HomePage from "@/features/home/components/HomePage";
import {
  getCategoriesServer,
  getProductsServer,
} from "@/features/products/data.server";

export default async function Home() {
  // Fetches data on server for  instant page load
  const [categories, featuredProductsData] = await Promise.all([
    getCategoriesServer(),
    getProductsServer({ featured: true, limit: 4 }),
  ]);

  return (
    <HomePage
      categories={categories}
      featuredProducts={featuredProductsData.data}
    />
  );
}
