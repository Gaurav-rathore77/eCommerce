import { NextRequest, NextResponse } from "next/server";
import { getCouponById, updateCoupon, deleteCoupon } from "@/lib/coupon-db";
import { verifyAuth } from "@/lib/auth";

// GET /api/coupons/[id] - Get single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coupon = await getCouponById(id);

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

// PUT /api/coupons/[id] - Update coupon (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate discount value if provided
    if (body.discountValue !== undefined && body.discountValue < 0) {
      return NextResponse.json(
        { error: "Discount value cannot be negative" },
        { status: 400 }
      );
    }

    // Validate percentage discount
    if (
      body.discountType === "percentage" &&
      body.discountValue !== undefined &&
      body.discountValue > 100
    ) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (body.code !== undefined) updates.code = body.code.toUpperCase();
    if (body.description !== undefined) updates.description = body.description;
    if (body.discountType !== undefined) updates.discountType = body.discountType;
    if (body.discountValue !== undefined) updates.discountValue = body.discountValue;
    if (body.minOrderAmount !== undefined) updates.minOrderAmount = body.minOrderAmount;
    if (body.maxDiscount !== undefined) updates.maxDiscount = body.maxDiscount;
    if (body.usageLimit !== undefined) updates.usageLimit = body.usageLimit;
    if (body.userUsageLimit !== undefined) updates.userUsageLimit = body.userUsageLimit;
    if (body.startDate !== undefined) updates.startDate = body.startDate;
    if (body.endDate !== undefined) updates.endDate = body.endDate;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    const coupon = await updateCoupon(id, updates);

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE /api/coupons/[id] - Delete coupon (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deleteCoupon(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
