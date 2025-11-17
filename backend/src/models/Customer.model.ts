import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    income: {
      type: Number,
      min: [0, "Income cannot be negative"],
    },
    creditScore: {
      type: Number,
      min: [300, "Credit score must be at least 300"],
      max: [850, "Credit score cannot exceed 850"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
