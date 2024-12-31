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
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
