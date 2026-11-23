import { useEffect } from "react";
import { products as previousProducts } from "../data/products";
import { useCart } from "../stores/cart";
import { useProducts } from "./useProducts";

export function useCartProducts(_filters?: object) {
  const result = useProducts({});
  const items = useCart((state) => state.items);
  const replaceProductId = useCart((state) => state.replaceProductId);
  useEffect(() => {
    if (result.loading || result.error) return;
    for (const item of items) {
      if (result.products.some((product) => product.id === item.productId))
        continue;
      const previous = previousProducts.find(
        (product) => product.id === item.productId,
      );
      const current =
        previous &&
        result.products.find((product) => product.slug === previous.slug);
      if (current) replaceProductId(item.productId, current.id);
    }
  }, [items, replaceProductId, result.error, result.loading, result.products]);
  return result;
}
