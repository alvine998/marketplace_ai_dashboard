import api from "./api";

export interface SellerUser {
  id: string;
  username: string;
  email: string;
}

export interface Seller {
  id: string;
  storeName: string;
  description: string;
  address: string;
  logoUrl: string;
  isVerified: boolean;
  isOfficial: boolean;
  user: SellerUser;
}

export interface SellersResponse {
  totalItems: number;
  data: Seller[];
  totalPages: number;
  currentPage: number;
}

export interface SellerQueryParams {
  page?: number;
  limit?: number;
  isVerified?: boolean;
  isOfficial?: boolean;
  search?: string;
}

export const sellerService = {
  async getSellers(params: SellerQueryParams = {}): Promise<SellersResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.isVerified !== undefined)
      queryParams.append("isVerified", params.isVerified.toString());
    if (params.isOfficial !== undefined)
      queryParams.append("isOfficial", params.isOfficial.toString());
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `/sellers${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<SellersResponse>(url);
    return response.data;
  },

  async getSellerById(id: string): Promise<Seller> {
    const response = await api.get<Seller>(`/sellers/${id}`);
    return response.data;
  },
};

export default sellerService;
