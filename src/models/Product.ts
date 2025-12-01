import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      // TODO: Add validation for price precision (max 2 decimal places)
    },
    category: {
      type: String,
      required: true,
      // TODO: Should be enum but categories are not finalized
      // Possible values: electronics, clothing, books, home, sports
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    imageUrl: {
      type: String,
      // TODO: Add URL validation
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model<IProduct>("Product", productSchema);
