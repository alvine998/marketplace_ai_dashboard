import api from "./api";

export interface Promo {
  id: string;
  title: string;
  message: string;
  ctaText?: string;
  isActive: boolean;
  status: string; // 'draft', 'published', 'expired', etc.
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromoInput {
  title: string;
  message: string;
  ctaText?: string;
  isActive: boolean;
  status: string;
  image?: File | null;
}

const promoService = {
  getPromos: async (params?: any) => {
    const response = await api.get("/popup-promos", { params });
    return response.data;
  },

  getPromoById: async (id: string) => {
    const response = await api.get(`/popup-promos/${id}`);
    return response.data;
  },

  createPromo: async (data: PromoInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("message", data.message);
    if (data.ctaText) formData.append("ctaText", data.ctaText);
    formData.append("isActive", String(data.isActive));
    formData.append("status", data.status);
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post("/popup-promos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updatePromo: async (id: string, data: Partial<PromoInput>) => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.message) formData.append("message", data.message);
    if (data.ctaText !== undefined)
      formData.append("ctaText", data.ctaText || "");
    if (data.isActive !== undefined)
      formData.append("isActive", String(data.isActive));
    if (data.status) formData.append("status", data.status);
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.put(`/popup-promos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletePromo: async (id: string) => {
    const response = await api.delete(`/popup-promos/${id}`);
    return response.data;
  },
};

export default promoService;
