import api from "./api";

export interface Voucher {
  id: string;
  code: string;
  type: string;
  valueType: string;
  value: number;
  minTransaction: number;
  maxLimit: number;
  quota: number;
  expiryDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVoucherPayload {
  code: string;
  type: string;
  valueType: string;
  value: number;
  minTransaction: number;
  maxLimit: number;
  quota: number;
  expiryDate: string;
  isActive: boolean;
}

export interface UpdateVoucherPayload extends Partial<CreateVoucherPayload> {}

export interface VoucherResponse {
  data: Voucher[];
  items?: Voucher[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const voucherService = {
  async getVouchers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<VoucherResponse> {
    const response = await api.get("/vouchers", { params });
    return response.data;
  },

  async getVoucherById(id: string): Promise<Voucher> {
    const response = await api.get(`/vouchers/${id}`);
    return response.data;
  },

  async create(payload: CreateVoucherPayload): Promise<Voucher> {
    const response = await api.post("/vouchers", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateVoucherPayload): Promise<Voucher> {
    const response = await api.put(`/vouchers/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/vouchers/${id}`);
  },
};

export default voucherService;
