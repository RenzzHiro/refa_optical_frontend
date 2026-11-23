import { useCallback, useEffect, useState } from "react";
import { getMyOrders, getOrder } from "../api/orders";
import type { CustomerOrder } from "../types";
export function useOrders(email: string | null) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]),
    [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(email ? await getMyOrders(email) : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [email]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { orders, loading, refresh };
}
export function useOrder(orderId: string, email: string | null) {
  const [order, setOrder] = useState<CustomerOrder>(),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    if (email)
      getOrder(orderId, email)
        .then((value) => {
          if (active) setOrder(value);
        })
        .catch(() => {
          if (active) setOrder(undefined);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    else {
      setOrder(undefined);
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [orderId, email]);
  return { order, loading };
}
