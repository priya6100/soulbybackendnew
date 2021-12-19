/** @format */

const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  addItemToWishlist,
  getWishlistItems,
  removeWishlistItems,
} = require("../controllers/wishlist");

const router = express.Router();

router.post(
  "/user/wishlist/addtowishlist",
  requireSignin,
  userMiddleware,
  addItemToWishlist
);
router.get(
  "/user/getWishlistItems",
  requireSignin,
  userMiddleware,
  getWishlistItems
);
router.post(
  "/user/wishlist/removeItem",
  requireSignin,
  userMiddleware,
  removeWishlistItems
);

module.exports = router;
