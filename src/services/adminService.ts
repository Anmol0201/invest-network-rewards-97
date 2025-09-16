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
  dailyEarning: number;
  duration: number;
  description: string;
  isActive: boolean;
}

export class AdminService {
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

  // Investment Plans
  static async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    try {
      const response = await apiClient.get<{
        plans: InvestmentPlan[];
        total: number;
      }>("/admin/plans");
      if (response.success && response.data) {
        return response.data.plans;
      }
      throw new Error(response.message || "Failed to fetch investment plans");
    } catch (error) {
      console.error("Error fetching investment plans:", error);
      throw error;
    }
  }

  static async createInvestmentPlan(
    planData: Omit<InvestmentPlan, "id">
  ): Promise<InvestmentPlan> {
    try {
      const response = await apiClient.post<{ plan: InvestmentPlan }>(
        "/admin/plans",
        planData
      );
      if (response.success && response.data) {
        return response.data.plan;
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
      const response = await apiClient.put<{ plan: InvestmentPlan }>(
        `/admin/plans/${planId}`,
        planData
      );
      if (response.success && response.data) {
        return response.data.plan;
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
  ): Promise<InvestmentPlan> {
    try {
      const response = await apiClient.put<{ plan: InvestmentPlan }>(
        `/admin/plans/${planId}/toggle`
      );
      if (response.success && response.data) {
        return response.data.plan;
      }
      throw new Error(
        response.message || "Failed to toggle investment plan status"
      );
    } catch (error) {
      console.error("Error toggling investment plan status:", error);
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
