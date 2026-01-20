import api from "./api";

export interface Seller {
  id: string;
  username: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  seller: Seller;
}

export interface ProductsResponse {
  totalItems: number;
  data: Product[];
  totalPages: number;
  currentPage: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  subcategoryId?: string;
  category?: string;
  search?: string;
}

export const productService = {
  async getProducts(
    params: ProductQueryParams = {},
  ): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.subcategoryId)
      queryParams.append("subcategoryId", params.subcategoryId);
    if (params.category) queryParams.append("category", params.category);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<ProductsResponse>(url);
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};

export default productService;
