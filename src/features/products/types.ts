// Defines types for products and categories
export interface Category {
  id: string;
  name: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Main Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string | Category;
  imageUrl?: string;
  featured?: boolean;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Response structure for fetching products with pagination
export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props
export interface ProductDetailProps {
  product: Product;
}

export interface ProductListProps {
  initialProducts: Product[];
  initialTotalPages: number;
  categories: Category[];
}

export interface HomePageProps {
  categories: Category[];
  featuredProducts: Product[];
}
