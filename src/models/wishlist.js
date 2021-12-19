/** @format */

const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wishlistItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        img: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishListSchema);
