import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/features/products/components/ProductDetail";
import { getProductByIdServer } from "@/features/products/data.server";

// Generates dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdServer(id);

  if (!product) {
    return {
      title: "Product Not Found | Syntax",
      description: "The product you're looking for could not be found.",
    };
  }

  // Gets category name for better SEO
  const categoryName =
    typeof product.categoryId === "object" && product.categoryId !== null
      ? product.categoryId.name
      : "Product";

  return {
    title: `${product.name} | Syntax`,
    description:
      product.description ||
      `Buy ${product.name} - Premium ${categoryName} at Syntax. ${
        product.stock > 0 ? "In stock" : "Out of stock"
      }. Price: $${product.price.toFixed(2)}`,
    openGraph: {
      title: product.name,
      description:
        product.description || `Premium ${categoryName} - ${product.name}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description || `Premium ${categoryName} - ${product.name}`,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Fetch product on the server
  const { id } = await params;
  const product = await getProductByIdServer(id);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
