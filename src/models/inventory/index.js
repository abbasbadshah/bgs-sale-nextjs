// models/Inventory.js
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  rate: {
    type: Number,
    required: [true, "Purchase rate is required"],
    min: [0, "Rate cannot be negative"],
  },
  salingRate: {
    type: Number,
    required: [true, "Selling rate is required"],
    min: [0, "Selling rate cannot be negative"],
  },
  regularBulkRate: {
    type: Number,
    required: [true, "Regular bulk buyer rate is required"],
    min: [0, "Rate cannot be negative"],
  },
  bulkQuantityRate: {
    type: Number,
    required: [true, "Bulk quantity rate is required"],
    min: [0, "Rate cannot be negative"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory", // Ensure the model name matches the exported name
    required: [true, "Product category is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
export default Inventory;
