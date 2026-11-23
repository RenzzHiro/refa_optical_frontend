import { request } from "./client";
import type { CustomerAddress, CustomerOrder, PrescriptionDetails } from "../types";

interface ApiOrder extends Omit<
  CustomerOrder,
  "customerEmail" | "prescriptionName"
> {
  prescription?: { originalName: string } | null;
}
interface CreateOrderInput {
  items: { productId: string; lensId: string; quantity: number; colorName: string }[];
  address: CustomerAddress;
}
export interface PaymentSession {
  orderId: string;
  snapToken: string;
  redirectUrl: string;
  paymentStatus: string;
}

function normalize(order: ApiOrder): CustomerOrder {
  const { prescription, ...rest } = order;
  return {
    ...rest,
    customerEmail: "",
    prescriptionName: prescription?.originalName,
  };
}

export async function getMyOrders(
  _email?: string | null,
): Promise<CustomerOrder[]> {
  return (await request<ApiOrder[]>("/orders")).map(normalize);
}
export async function getOrder(id: string, _email?: string | null) {
  return normalize(
    await request<ApiOrder>(`/orders/${encodeURIComponent(id)}`),
  );
}
export async function createOrder(input: CreateOrderInput) {
  return normalize(
    await request<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  );
}
export async function uploadPrescription(orderId: string, file: File, details: PrescriptionDetails) {
  const body = new FormData();
  body.append("file", file);
  body.append("details", JSON.stringify(details));
  return request<{
    id: string;
    fileName: string;
    contentType: string;
    size: number;
  }>(`/orders/${encodeURIComponent(orderId)}/prescription`, {
    method: "POST",
    body,
  });
}
export async function createPayment(orderId: string) {
  return request<PaymentSession>(
    `/orders/${encodeURIComponent(orderId)}/payments`,
    { method: "POST" },
  );
}
export async function refreshOrder(id: string) {
  return getOrder(id);
}
