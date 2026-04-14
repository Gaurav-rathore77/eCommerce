import { NextRequest, NextResponse } from "next/server";
import {
  getAllCoupons,
  getActiveCoupons,
  createCoupon,
  validateCoupon,
} from "@/lib/coupon-db";
import { verifyAuth } from "@/lib/auth";

// GET /api/coupons - Get all coupons (admin) or active coupons (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const cartTotal = searchParams.get("cartTotal");

    // Validate coupon code
    if (code && cartTotal) {
      const result = await validateCoupon(code, parseFloat(cartTotal));
      return NextResponse.json(result);
    }

    // Check if admin
    const auth = await verifyAuth(request);
    if (auth) {
      const coupons = await getAllCoupons();
      return NextResponse.json({ coupons });
    }

    // Return active coupons for public
    const coupons = await getActiveCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Create new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.code || !body.discountType || body.discountValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(body.discountType)) {
      return NextResponse.json(
        { error: "Invalid discount type" },
        { status: 400 }
      );
    }

    // Validate discount value
    if (body.discountValue < 0) {
      return NextResponse.json(
        { error: "Discount value cannot be negative" },
        { status: 400 }
      );
    }

    // Validate percentage discount
    if (body.discountType === "percentage" && body.discountValue > 100) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    const coupon = await createCoupon({
      code: body.code.toUpperCase(),
      description: body.description || "",
      discountType: body.discountType,
      discountValue: body.discountValue,
      minOrderAmount: body.minOrderAmount,
      maxDiscount: body.maxDiscount,
      usageLimit: body.usageLimit,
      userUsageLimit: body.userUsageLimit,
      startDate: body.startDate,
      endDate: body.endDate,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}
