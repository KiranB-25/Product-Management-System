import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product, IProduct } from "@/lib/models/Product";

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// CREATE new product
export async function POST(req: Request) {
  try {
    await connectDB();
    const body: Partial<IProduct> = await req.json();
    const { name, price, description, visibility, imageUrl } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const newProduct = await Product.create({ name, price, description, visibility, imageUrl });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}