import { request } from "./client";
import type { Product } from "../types";
export interface CatalogFilters {
  query?: string;
  gender?: string;
  faceType?: string;
  frame?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  sort?: string;
}

function normalizeProduct(product: Product): Product {
  const colors = Array.isArray(product.colors) && product.colors.length
    ? product.colors
    : [{ name: "Default", hex: "#171717" }];
  const isUsableImage = (value: string) => typeof value === "string" && (/^https?:\/\//i.test(value) || value.startsWith("/"));
  const images = Array.isArray(product.images)
    ? product.images.filter(isUsableImage)
    : [];
  const image = isUsableImage(product.image)
    ? product.image
    : images[0] || "";
  const gallery = images.length ? images : image ? [image] : [];

  return {
    ...product,
    category: product.category === "minus" ? "minus" : "fashion",
    description: product.description || "",
    image,
    images: gallery,
    colors,
    gender: Array.isArray(product.gender) && product.gender.length ? product.gender : ["Unisex"],
    faceTypes: Array.isArray(product.faceTypes) ? product.faceTypes : [],
    frame: product.frame || "Bulat",
    stock: Number.isFinite(product.stock) ? product.stock : 0,
  };
}

export async function getProducts(
  filters: CatalogFilters = {},
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.query) params.set("query", filters.query);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.faceType) params.set("face_type", filters.faceType);
  if (filters.frame) params.set("frame", filters.frame);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("min_price", String(filters.minPrice));
  // The slider's upper endpoint is labeled "Rp 500 ribu+", so it means no cap.
  if (filters.maxPrice && filters.maxPrice < 500000)
    params.set("max_price", String(filters.maxPrice));
  if (filters.sort && filters.sort !== "featured")
    params.set("sort", filters.sort);
  const query = params.toString();
  const products = await request<Product[]>(`/products${query ? `?${query}` : ""}`);
  return products.map(normalizeProduct);
}
export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  try {
    return normalizeProduct(await request<Product>(`/products/${encodeURIComponent(slug)}`));
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404)
      return undefined;
    throw error;
  }
}
