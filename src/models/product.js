/** @format */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parentId: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      S_quantity: {
        type: Number,
        required: true,
      },
      M_quantity: {
        type: Number,
        required: true,
      },
      X_quantity: {
        type: Number,
        required: true,
      },
      XL_quantity: {
        type: Number,
        required: true,
      },
      X2L_quantity: {
        type: Number,
        required: true,
      },
      X3L_quantity: {
        type: Number,
        required: true,
      },
    },
    color: [
      {
        type: String,
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      // required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skuCode: {
      type: String,
      required: true,
    },
    offer: {
      type: Number,
    },
    productPictures: [
      {
        type: String,
      },
    ],
    cancelProduct: [
      {
        type: {
          type: String,
          enum: ["canclled"],
          default: "canclled",
        },
        date: {
          type: Date,
        },
        isRemoved: {
          type: Boolean,
          default: false,
        },
      },
    ],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
