import api from "./api";

export interface DashboardSummary {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: string;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  totalSold: number;
  product: {
    name: string;
    price: number;
  };
}

export interface DashboardAnalytics {
  revenueTrend: RevenueTrendItem[];
  topProducts: TopProduct[];
}

const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get("/dashboard/admin/summary");
    return response.data.data;
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    const response = await api.get("/dashboard/analytics");
    return response.data.data;
  },
};

export default dashboardService;
