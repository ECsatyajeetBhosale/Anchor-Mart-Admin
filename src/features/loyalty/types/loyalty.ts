/**
 * Loyalty Types
 * Defines all TypeScript interfaces for loyalty points tracking
 */

export interface SailorLoyalty {
  id: number;
  user_email: string;
  user_id: number;
  first_name: string;
  last_name: string;
  referral_points: number;
  loyalty_points: number;
  total_points: number;
}

/**
 * Filter State
 */
export interface LoyaltyFilters {
  search: string;
  ordering: string;
}

/**
 * API Response Types
 */
export interface LoyaltyResponse {
  data: SailorLoyalty[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    next?: string | null;
    previous?: string | null;
  };
}

/**
 * API Query Parameters
 */
export interface LoyaltyQueryParams {
  page?: number;
  limit?: number; // Maps to page_size on backend
  search?: string;
  ordering?: string;
}
