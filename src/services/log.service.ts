import api from "./api";

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: {
    [key: string]: any;
  };
  ipAddress: string;
  createdAt: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  isSuccess: boolean;
  ipAddress: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const logService = {
  async getActivityLogs(
    params: LogQueryParams = {},
  ): Promise<PaginatedResponse<ActivityLog>> {
    const response = await api.get<PaginatedResponse<ActivityLog>>(
      "/logs/activity",
      { params },
    );
    return response.data;
  },

  async getLoginAttempts(
    params: LogQueryParams = {},
  ): Promise<PaginatedResponse<LoginAttempt>> {
    const response = await api.get<PaginatedResponse<LoginAttempt>>(
      "/logs/login-attempts",
      { params },
    );
    return response.data;
  },
};

export default logService;
