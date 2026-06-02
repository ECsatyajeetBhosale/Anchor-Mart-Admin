export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/superadmin/admin/login/",
  },
  DASHBOARD: {
    HEADER: "/api/superadmin/dashboard/dashboard/",
  },
  CATALOG: {
    GET_CATEGORIES: "/api/superadmin/catalog/get-categories/",
    ADD_CATEGORY: "/api/superadmin/catalog/add-category/",
    UPDATE_CATEGORY: (id: string) => `/api/superadmin/catalog/update-category/${id}/`,
    DELETE_CATEGORY: (id: string) => `/api/superadmin/catalog/delete-category/${id}/`,
    GET_PRODUCTS: "/api/superadmin/catalog/get-products/",
  },
} as const;
