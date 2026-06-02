export interface ProductImage {
  id: string;
  image: string;
  alt_text?: string;
}

export interface Product {
  id: string;
  name: string;
  category_name: string;
  base_price: string;
  average_rating: string | number;
  is_active: boolean;
  created_at: string;
  images: ProductImage[];
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
