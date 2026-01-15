import api from "./api";

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  imageUrl?: string;
  parentId?: string | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  imageUrl?: string;
  parentId?: string | null;
}

export interface CategoryListResponse {
  data: Category[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const categoryService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CategoryListResponse> {
    const response = await api.get<CategoryListResponse>("/categories", {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const response = await api.post<Category>("/categories", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
