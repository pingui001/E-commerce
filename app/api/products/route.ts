import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/app/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 6;
  const search = searchParams.get("search")?.trim() || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : null;

  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (minPrice !== null || maxPrice !== null) {
    query.price = {};
    if (minPrice !== null) query.price.$gte = minPrice;
    if (maxPrice !== null) query.price.$lte = maxPrice;
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    products,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function POST(req: Request) {
  await connectDB();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as File;

  const buffer = Buffer.from(await image.arrayBuffer());

  const upload: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "productos" },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    ).end(buffer);
  });

  const product = await Product.create({
    name,
    price,
    image: upload.secure_url,
  });

  return NextResponse.json(product);
}
