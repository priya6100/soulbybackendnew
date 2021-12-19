/** @format */

const express = require("express");
const { requireSignin, adminMiddleware } = require("../common-middleware");
const {
  createProduct,
  createProducts,
  getProductsBySlug,
  deleteAllProducts,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  postProducts,
  uploadImages,
} = require("../controllers/product");
const multer = require("multer");

const shortid = require("shortid");
const path = require("path");
//const { addCategory, getCategories } = require('../controllers/category');
const router = express.Router();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/uploads/images", upload.array("productPictures"), uploadImages);
router.post("/product/create", requireSignin, adminMiddleware, createProduct);

router.post("/products/create", createProducts);
// requireSignin, adminMiddleware,
router.get("/products/:slug", getProductsBySlug);
//router.get('/category/getCategories',getCategories);
router.get("/products", getProducts);
router.get("/product/:productId", getProductDetailsById);

router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);

router.delete("/products", deleteAllProducts);

router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

module.exports = router;
