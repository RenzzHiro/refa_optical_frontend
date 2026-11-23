import { useEffect, useState } from "react";
import { getProductBySlug } from "../api/catalog";
import type { Product } from "../types";
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product>(),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getProductBySlug(slug)
      .then((value) => {
        if (active) setProduct(value);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  return { product, loading };
}
