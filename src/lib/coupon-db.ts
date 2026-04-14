import fs from "fs/promises";
import path from "path";
import { Coupon } from "@/types/coupon";

const COUPONS_FILE = path.join(process.cwd(), "data", "coupons.json");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read coupons from file
async function readCouponsDb(): Promise<Coupon[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(COUPONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write coupons to file
async function writeCouponsDb(coupons: Coupon[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get all coupons
export async function getAllCoupons(): Promise<Coupon[]> {
  return readCouponsDb();
}

// Get active coupons only
export async function getActiveCoupons(): Promise<Coupon[]> {
  const coupons = await readCouponsDb();
  const now = new Date().toISOString();
  return coupons.filter(
    (c) =>
      c.isActive &&
      (!c.startDate || c.startDate <= now) &&
      (!c.endDate || c.endDate >= now) &&
      (!c.usageLimit || c.usageCount < c.usageLimit)
  );
}

// Get coupon by ID
export async function getCouponById(id: string): Promise<Coupon | null> {
  const coupons = await readCouponsDb();
  return coupons.find((c) => c.id === id) || null;
}

// Get coupon by code
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const coupons = await readCouponsDb();
  return coupons.find((c) => c.code.toUpperCase() === code.toUpperCase()) || null;
}

// Create new coupon
export async function createCoupon(
  couponData: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usageCount">
): Promise<Coupon> {
  const coupons = await readCouponsDb();

  // Check if code already exists
  if (coupons.some((c) => c.code.toUpperCase() === couponData.code.toUpperCase())) {
    throw new Error("Coupon code already exists");
  }

  const now = new Date().toISOString();
  const newCoupon: Coupon = {
    ...couponData,
    id: generateId(),
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  coupons.push(newCoupon);
  await writeCouponsDb(coupons);
  return newCoupon;
}

// Update coupon
export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon | null> {
  const coupons = await readCouponsDb();
  const index = coupons.findIndex((c) => c.id === id);

  if (index === -1) return null;

  // Check code uniqueness if updating code
  if (updates.code && updates.code !== coupons[index].code) {
    if (coupons.some((c) => c.code.toUpperCase() === updates.code!.toUpperCase())) {
      throw new Error("Coupon code already exists");
    }
  }

  coupons[index] = {
    ...coupons[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeCouponsDb(coupons);
  return coupons[index];
}

// Delete coupon
export async function deleteCoupon(id: string): Promise<boolean> {
  const coupons = await readCouponsDb();
  const filtered = coupons.filter((c) => c.id !== id);

  if (filtered.length === coupons.length) return false;

  await writeCouponsDb(filtered);
  return true;
}

// Validate and apply coupon
export async function validateCoupon(
  code: string,
  cartTotal: number,
  userId?: string
): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message?: string }> {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, message: "Coupon is not active" };
  }

  const now = new Date().toISOString();
  if (coupon.startDate && coupon.startDate > now) {
    return { valid: false, message: "Coupon is not yet valid" };
  }
  if (coupon.endDate && coupon.endDate < now) {
    return { valid: false, message: "Coupon has expired" };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed cart total
  if (discount > cartTotal) {
    discount = cartTotal;
  }

  return { valid: true, coupon, discount };
}

// Increment coupon usage
export async function incrementCouponUsage(id: string): Promise<void> {
  const coupons = await readCouponsDb();
  const index = coupons.findIndex((c) => c.id === id);

  if (index !== -1) {
    coupons[index].usageCount += 1;
    await writeCouponsDb(coupons);
  }
}
