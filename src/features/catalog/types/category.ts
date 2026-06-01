export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryPayload {
  id?: string;
  name: string;
  description: string;
  image: string;
  is_active?: boolean;
}

export interface CategoryResponse {
  data: Category;
  message?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CategoriesResponse {
  data: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
