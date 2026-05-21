export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  min_purchase_amount: string;
  max_discount_amount: string;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  is_public: boolean;
  usage_limit: number | null;
  times_used: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sort?: string;
  order?: string;
}

export interface CouponPayload {
  code: string;
  image: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount?: number | null;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  is_public: boolean;
  is_active?: boolean;
}

export interface CouponsResponse {
  data: Coupon[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
