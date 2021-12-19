/** @format */

const express = require("express");
const { requireSignin, adminMiddleware } = require("../../common-middleware");
const {
  updateOrder,
  getCustomerOrders,
  deleteOrder,
} = require("../../controllers/admin/order.admin");
const router = express.Router();

router.post(`/order/update`, requireSignin, adminMiddleware, updateOrder);
router.get(
  `/order/getCustomerOrders`,
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);

router.delete("/orders/delete", deleteOrder);

module.exports = router;
