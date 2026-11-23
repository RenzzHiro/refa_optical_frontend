import { request, requestBlob } from "./client";
import type { CustomerOrder, LensOption, Product } from "../types";

export type ProductInput = Omit<Product, "id"> & {
  id?: string;
  isActive?: boolean;
};
export type LensInput = Omit<LensOption, "id" | "requiresPrescription"> & { id?: string };

export const adminApi = {
  listProducts: () => request<Product[]>("/admin/products"),
  createProduct: (product: ProductInput) =>
    request<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, product: ProductInput) =>
    request<Product>(`/admin/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  deactivateProduct: (id: string) =>
    request<{ message: string }>(`/admin/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  deleteProductPermanently: (id: string) =>
    request<{ message: string }>(
      `/admin/products/${encodeURIComponent(id)}/permanent`,
      { method: "DELETE" },
    ),
  setProductActive: (id: string, isActive: boolean) =>
    request<{ productId: string; isActive: boolean }>(
      `/admin/products/${encodeURIComponent(id)}/active`,
      { method: "PATCH", body: JSON.stringify({ isActive }) },
    ),
  adjustStock: (id: string, delta: number) =>
    request<{ productId: string; stock: number }>(
      `/admin/products/${encodeURIComponent(id)}/stock`,
      { method: "PATCH", body: JSON.stringify({ delta }) },
    ),
  listLenses: () => request<LensOption[]>("/admin/lenses"),
  createLens: (lens: LensInput) => request<LensOption>("/admin/lenses", { method: "POST", body: JSON.stringify(lens) }),
  updateLens: (id: string, lens: LensInput) => request<LensOption>(`/admin/lenses/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(lens) }),
  deactivateLens: (id: string) => request<{ message: string }>(`/admin/lenses/${encodeURIComponent(id)}`, { method: "DELETE" }),
  deleteLensPermanently: (id: string) => request<{ message: string }>(`/admin/lenses/${encodeURIComponent(id)}/permanent`, { method: "DELETE" }),
  setLensActive: (id: string, isActive: boolean) => request<{ lensId: string; isActive: boolean }>(`/admin/lenses/${encodeURIComponent(id)}/active`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
  adjustLensStock: (id: string, delta: number) => request<{ lensId: string; stock: number }>(`/admin/lenses/${encodeURIComponent(id)}/stock`, { method: "PATCH", body: JSON.stringify({ delta }) }),
  listOrders: (status?: string) =>
    request<CustomerOrder[]>(
      `/admin/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`,
    ),
  updateOrderStatus: (
    id: string,
    status: "processing" | "completed" | "cancelled",
  ) =>
    request<CustomerOrder>(`/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getPrescription: (id: string) =>
    requestBlob(`/admin/orders/${encodeURIComponent(id)}/prescription`),
};
