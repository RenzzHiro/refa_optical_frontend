export type Gender = "Pria" | "Wanita" | "Unisex";
export type FaceType = "Bulat" | "Kotak" | "Oval" | "Hati" | "Oblong";
export type FrameShape =
  | "Bulat"
  | "Kotak"
  | "Cat eye"
  | "Aviator"
  | "Rectangle";
export type ProductCategory = "minus" | "fashion";
export type LensType = "minus" | "anti_radiation" | "photochromic";
export interface LensOption {
  id: string;
  name: string;
  type: LensType;
  description: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  isActive: boolean;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  colors: { name: string; hex: string }[];
  gender: Gender[];
  faceTypes: FaceType[];
  frame: FrameShape;
  stock: number;
  isNew?: boolean;
  isActive?: boolean;
}
export interface CartItem {
  productId: string;
  quantity: number;
  colorName: string;
}
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled";
export type OrderStatus =
  | "awaiting_payment"
  | "processing"
  | "completed"
  | "cancelled";
export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  colorName: string;
  category?: ProductCategory;
  lensId?: string;
  lensName?: string;
  lensPrice?: number;
}
export interface CustomerAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}
export interface CustomerOrder {
  id: string;
  number: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  customerEmail: string;
  address: CustomerAddress;
  prescriptionName?: string;
  requiresPrescription?: boolean;
}
export interface PrescriptionDetails {
  rightSphere: string;
  rightCylinder: string;
  rightAxis: string;
  leftSphere: string;
  leftCylinder: string;
  leftAxis: string;
  pd: string;
}
