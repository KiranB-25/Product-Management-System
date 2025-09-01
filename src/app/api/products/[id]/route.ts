import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Product, IProduct } from "@/lib/models/Product";

type UpdateProductBody = Partial<Omit<IProduct, "_id">> & {
  imageUrl?: string;
  visibility?: boolean;
};

// GET /api/products/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params; // 👈 must await

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  try {
    const product = await Product.findById(id).lean<IProduct>();
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body: UpdateProductBody = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    }).lean<IProduct>();

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id).lean<IProduct>();
    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}