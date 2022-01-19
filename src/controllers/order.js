/** @format */

const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");

exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      const { body } = req;

      let orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      let cancleOrder = [
        {
          type: "canclled",
          date: new Date(),
          isCanclled: false,
        },
      ];
      let items = body.items.map((newItem) => {
        removeOrder = [
          {
            type: "removed",
            date: new Date(),
            isRemoveOrder: false,
          },
        ];
        return { ...newItem, removeOrder };
      });

      const userId = req.user._id;
      const order = new Order({
        ...body,
        user: userId,
        items,
        cancleOrder,
        orderStatus,
      });
      // res.send(items);
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          console.log(order, ">>orderNew");
          res.status(201).json({ order });
        }
      });
    }
  });
};

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus orderStatus cancleOrder items")
    .populate("items.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
        console.log(orders.totalAmount);
      }
    });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        console.log(order.totalAmount);
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
exports.cancleOrders = async (req, res) => {
  try {
    const customerOrder = await Order.findById(req.body.orderId);
    const itemIndx = customerOrder.items.findIndex(
      (orderItem) => orderItem.productId.toString() === req.body.productId
    );
    if (itemIndx === -1) {
      return res.status(400).json({ error: "No Peoduct found" });
    }
    customerOrder.items[itemIndx].removeOrder[0].isRemoveOrder = true;
    customerOrder.items[itemIndx].removeOrder[0].date = new Date();
    const updateOrder = await Order.findOneAndUpdate(
      { _id: req.body.orderId },
      { items: customerOrder.items },
      { useFindAndModify: false }
    );
    if (!updateOrder)
      return res.status(400).json({ message: "Order not cancel" });
    return res.status(201).json(updateOrder);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
