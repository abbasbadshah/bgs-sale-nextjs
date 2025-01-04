// models/daily-sale.js
import mongoose from "mongoose";

const dailySaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now,
  },
  products: [
    {
      type: String,
      required: [true, "At least one product is required"],
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0.01, "Total amount must be greater than 0"],
  },
  paymentType: {
    type: String,
    required: [true, "Payment type is required"],
    enum: ["cash", "online"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DailySale = mongoose.models.DailySale || mongoose.model("DailySale", dailySaleSchema);

export default DailySale;