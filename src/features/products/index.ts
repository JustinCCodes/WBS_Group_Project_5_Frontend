// Components
export { default as ProductDetail } from "./components/ProductDetail";
export { default as ProductList } from "./components/ProductList";

// Types
export type {
  Category,
  Product,
  ProductsResponse,
  ProductDetailProps,
  ProductListProps,
  HomePageProps,
} from "./types";

// Data functions (client side)
export { getProducts, validateProductIds } from "./data";

// Data functions (server side)
export {
  getCategoriesServer,
  getProductByIdServer,
  getProductsServer,
} from "./data.server";
