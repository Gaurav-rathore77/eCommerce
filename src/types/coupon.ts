export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number; // percentage (0-100) or fixed amount
  minOrderAmount?: number; // minimum cart value required
  maxDiscount?: number; // max discount for percentage coupons
  usageLimit?: number; // how many times can be used total
  usageCount: number; // how many times used so far
  userUsageLimit?: number; // per user limit
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
  originalTotal: number;
  finalTotal: number;
}
