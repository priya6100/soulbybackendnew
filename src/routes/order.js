/** @format */

const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  addOrder,
  getOrders,
  getOrder,
  cancleOrders,
  getCustomerOrders,
  getOrdersByPin,
} = require("../controllers/order");
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);
router.post("/getOrdersByPin", requireSignin, userMiddleware, getOrdersByPin);
router.get(
  `/getCustomerOrders`,
  requireSignin,
  userMiddleware,
  getCustomerOrders
);
router.post("/cancleOrderDetails", requireSignin, userMiddleware, cancleOrders);

module.exports = router;
