export interface Category {
  _id: string;
  id: string;
  name: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string | Category;
  imageUrl?: string;
  featured?: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
