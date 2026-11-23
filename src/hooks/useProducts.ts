import { useEffect, useState } from "react";
import { getProducts, type CatalogFilters } from "../api/catalog";
import type { Product } from "../types";
export function useProducts(filters: CatalogFilters) {
  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts(filters)
      .then((data) => {
        if (active) {
          setProducts(data);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Koleksi gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    filters.query,
    filters.gender,
    filters.faceType,
    filters.frame,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ]);
  return { products, loading, error };
}
