import { apiClient, ApiResponse } from "../lib/api";

// Types for admin dashboard data
export interface DashboardStats {
  totalUsers: number;
  totalNews: number;
  activeUsers: number;
  adminUsers: number;
  totalEarnings?: number;
  totalWithdrawals?: number;
  pendingWithdrawals?: number;
}

export interface UserStats {
  balance: number;
  todayEarning: number;
  weekEarning: number;
  monthEarning: number;
  level: number;
  levelProgress: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: any; // Firebase timestamp
  updatedAt: any; // Firebase timestamp
  lastLogin?: any; // Firebase timestamp
  preferences?: any;
  referralCode?: string;
  referredBy?: string | null;
  totalReferrals?: number;
  referralEarnings?: number;
  wallet?: {
    balance: number;
    totalEarnings: number;
    totalWithdrawals: number;
  };
  userLevel?: {
    currentLevel: number;
    currentExp: number;
    totalExp: number;
  };
}

export interface InvestmentPlan {
  id: string;
  name: string;
  price: number;
  dailyReturn: number;
  weeklyReturn?: number;
  monthlyReturn?: number;
  validity: number;
  maxWithdrawal: number;
  features: string[];
  levels?: number;
  isActive: boolean;
  subscribers: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanStats {
  totalPlans: number;
  activePlans: number;
  totalSubscribers: number;
  totalRevenue: number;
  avgDailyPayout: number;
}

export interface AdminPlansResponse {
  plans: InvestmentPlan[];
  stats: PlanStats;
}

export interface PlanAnalytics {
  plan: InvestmentPlan;
  analytics: {
    totalSubscribers: number;
    activeSubscribers: number;
    completedSubscribers: number;
    totalRevenue: number;
    averageInvestmentAmount: number;
    dailyEarningsPaid: number;
    monthlyGrowth: string;
  };
  recentInvestments: Array<{
    id: string;
    userId: string;
    investmentAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export class AdminService {
  // Trading config (Admin)
  static async getTradingConfig() {
    const res = await apiClient.get(`/admin/trading/config`);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to get trading config');
  }

  static async updateTradingConfig(payload: { colorOptions?: string[]; numberRange?: { min: number; max: number }; multipliers?: any; }) {
    const res = await apiClient.put(`/admin/trading/config`, payload);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to update trading config');
  }

  static async getTradingOptions(gameType: 'color'|'number') {
    const res = await apiClient.get<{ options: string[]; multipliers: any }>(`/trading/options?gameType=${gameType}`);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to fetch trading options');
  }

  // Admin Trading Rounds
  static async listTradingRounds(params?: { gameType?: 'color'|'number'; status?: 'upcoming'|'open'|'closed'|'settled'|'cancelled'; limit?: number; }) {
    const qs = new URLSearchParams();
    if (params?.gameType) qs.set('gameType', params.gameType);
    if (params?.status) qs.set('status', params.status);
    if (params?.limit) qs.set('limit', String(params.limit));
    const res = await apiClient.get<{ rounds: any[] }>(`/admin/trading/rounds${qs.toString() ? `?${qs.toString()}` : ''}`);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to list trading rounds');
  }

  static async createTradingRound(payload: { gameType: 'color'|'number'; startsAt?: string | Date; endsAt: string | Date; options?: string[]; multipliers?: Record<string, number>; status?: 'upcoming'|'open'|'closed'; }) {
    const res = await apiClient.post(`/admin/trading/rounds`, payload);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to create trading round');
  }

  static async finalizeTradingRound(roundId: string, winningOption: string | number) {
    const res = await apiClient.post(`/admin/trading/rounds/finalize`, { roundId, winningOption });
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to finalize trading round');
  }

  static async cancelTradingRound(roundId: string) {
    const res = await apiClient.post(`/admin/trading/rounds/cancel`, { roundId });
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to cancel trading round');
  }

  static async getTradingRoundOrders(roundId: string) {
    const res = await apiClient.get(`/admin/trading/rounds/${roundId}/orders`);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to fetch trading round orders');
  }

  // Content Management - News
  static async createNewsArticle(payload: {
    title: string;
    content: string;
    summary: string;
    author: { name: string };
    category: 'technology' | 'business' | 'sports' | 'entertainment' | 'health' | 'science' | 'politics' | 'world';
    source: { name: string };
    readTime?: number;
    language?: 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';
    status?: 'draft' | 'published' | 'archived';
  }) {
    const res = await apiClient.post(`/news`, payload);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to create news');
  }

  // Content Management - Advertisements
  static async createAdvertisement(payload: {
    title: string;
    description?: string;
    type?: 'banner' | 'popup' | 'sidebar' | 'video';
    placement?: 'homepage' | 'dashboard' | 'sidebar' | 'footer';
    status?: 'draft' | 'active' | 'paused' | 'completed' | 'expired';
    imageUrl?: string;
    targetUrl?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    budget?: number;
    cpc?: number;
    cpm?: number;
  }) {
    const res = await apiClient.post(`/advertisements`, payload);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to create advertisement');
  }

  // Content Management - Banners
  static async createBanner(payload: {
    title: string;
    description?: string;
    imageUrl: string;
    mobileImageUrl?: string;
    targetUrl?: string;
    placement?: 'homepage' | 'dashboard' | 'sidebar' | 'footer';
    position?: number;
    startDate?: string | Date;
    endDate?: string | Date;
  }) {
    const res = await apiClient.post(`/banners`, payload);
    if (res.success && res.data) return res.data as any;
    throw new Error(res.message || 'Failed to create banner');
  }
  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>("/admin/stats");
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch dashboard stats");
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // User Management
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<{ users: User[]; total: number }>(
        "/admin/users"
      );
      if (response.success && response.data) {
        return response.data.users;
      }
      throw new Error(response.message || "Failed to fetch users");
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async updateUserRole(
    userId: string,
    role: "user" | "admin"
  ): Promise<void> {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/role`, {
        role,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  // Quick Stats for dashboard overview
  static async getQuickStats(): Promise<UserStats> {
    try {
      const response = await apiClient.get<UserStats>("/dashboard/stats");
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch quick stats");
    } catch (error) {
      console.error("Error fetching quick stats:", error);
      throw error;
    }
  }

  // Investment Plans - Updated for new API structure
  static async getInvestmentPlans(): Promise<AdminPlansResponse> {
    try {
      const response = await apiClient.get<AdminPlansResponse>("/admin/plans");
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch investment plans");
    } catch (error) {
      console.error("Error fetching investment plans:", error);
      throw error;
    }
  }

  static async createInvestmentPlan(
    planData: Omit<InvestmentPlan, "id" | "subscribers" | "revenue" | "createdAt" | "updatedAt">
  ): Promise<InvestmentPlan> {
    try {
      const response = await apiClient.post<InvestmentPlan | { plan: InvestmentPlan }>(
        "/admin/plans",
        planData
      );
      if (response.success && response.data) {
        // Support both shapes: { data: { plan: {...} } } and { data: { ... } }
        const data: any = response.data as any;
        return (data.plan ?? data) as InvestmentPlan;
      }
      throw new Error(response.message || "Failed to create investment plan");
    } catch (error) {
      console.error("Error creating investment plan:", error);
      throw error;
    }
  }

  static async updateInvestmentPlan(
    planId: string,
    planData: Partial<InvestmentPlan>
  ): Promise<InvestmentPlan> {
    try {
      const response = await apiClient.put<InvestmentPlan>(
        `/admin/plans/${planId}`,
        planData
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update investment plan");
    } catch (error) {
      console.error("Error updating investment plan:", error);
      throw error;
    }
  }

  static async deleteInvestmentPlan(planId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/admin/plans/${planId}`);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete investment plan");
      }
    } catch (error) {
      console.error("Error deleting investment plan:", error);
      throw error;
    }
  }

  static async toggleInvestmentPlanStatus(
    planId: string
  ): Promise<{ id: string; isActive: boolean }> {
    try {
      const response = await apiClient.put<{ id: string; isActive: boolean }>(
        `/admin/plans/${planId}/toggle`
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(
        response.message || "Failed to toggle investment plan status"
      );
    } catch (error) {
      console.error("Error toggling investment plan status:", error);
      throw error;
    }
  }

  static async getPlanAnalytics(planId: string): Promise<PlanAnalytics> {
    try {
      const response = await apiClient.get<PlanAnalytics>(
        `/admin/plans/${planId}/analytics`
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch plan analytics");
    } catch (error) {
      console.error("Error fetching plan analytics:", error);
      throw error;
    }
  }

  // Earnings Analytics
  static async getEarningsAnalytics(
    period: "today" | "week" | "month" = "week"
  ) {
    try {
      const response = await apiClient.get(
        `/dashboard/earnings?period=${period}`
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch earnings analytics");
    } catch (error) {
      console.error("Error fetching earnings analytics:", error);
      throw error;
    }
  }

  // User Progress
  static async getUserProgress() {
    try {
      const response = await apiClient.get("/dashboard/progress");
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch user progress");
    } catch (error) {
      console.error("Error fetching user progress:", error);
      throw error;
    }
  }

  // Dashboard Overview - Updated to use admin endpoint
  static async getDashboardOverview() {
    try {
      const response = await apiClient.get("/admin/overview");
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(
        response.message || "Failed to fetch admin dashboard overview"
      );
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      throw error;
    }
  }
}

export default AdminService;
