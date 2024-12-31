// models/online-sale.js
import mongoose from "mongoose";

const onlineSaleSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OnlineSale =
  mongoose.models.OnlineSale || mongoose.model("OnlineSale", onlineSaleSchema);

export default OnlineSale;
