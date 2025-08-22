import { Schema, model, models, Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId | string;
  name: string;
  price: number;
  description?: string;
  visibility: boolean;
  imageUrl?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  visibility: { type: Boolean, default: true },
  imageUrl: String,
});

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
