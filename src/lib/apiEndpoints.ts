export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/superadmin/admin/login/",
  },
  DASHBOARD: {
    HEADER: "/api/superadmin/dashboard/dashboard/",
  },
  COUPONS: {
    LIST: "/api/superadmin/orders/coupons/",
    DETAIL: (id: string) => `/api/superadmin/orders/coupons/${id}`,
    CREATE: "/api/superadmin/orders/coupons/add/",
    UPDATE: (id: string) => `/api/superadmin/orders/coupons/update/${id}/`,
  },
  LOYALTY: {
    POINTS: "/api/superadmin/orders/bonus-points/",
  },
  CATALOG: {
    GET_CATEGORIES: "/api/superadmin/catalog/get-categories/",
    ADD_CATEGORY: "/api/superadmin/catalog/add-category/",
    UPDATE_CATEGORY: (id: string) => `/api/superadmin/catalog/update-category/${id}/`,
    DELETE_CATEGORY: (id: string) => `/api/superadmin/catalog/delete-category/${id}/`,
  },
} as const;
