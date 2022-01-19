const { requireSignin, userMiddleware } = require("../common-middleware");
const { addOrder, getOrders, getOrder, cancleOrders } = require("../controllers/order");
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);
router.post("/cancleOrderDetails", requireSignin, userMiddleware, cancleOrders);

module.exports = router;