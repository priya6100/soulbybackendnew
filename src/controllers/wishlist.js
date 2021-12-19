/** @format */

const Wishlist = require("../models/wishlist");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Wishlist.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}
exports.addItemToWishlist = (req, res) => {
  Wishlist.findOne({ user: req.user._id }).exec((error, wishlist) => {
    if (error) return res.status(400).json({ error });
    if (wishlist) {
      //update cart
      let promiseArray = [];

      req.body.wishlistItems.forEach((wishlistItem) => {
        const product = wishlistItem.product;
        const item = wishlist.wishlistItems.find((w) => w.product == product);
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "wishlistItems.product": product };
          update = {
            $set: {
              "wishlistItems.$": wishlistItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              wishlistItems: wishlistItem,
            },
          };
        }

        console.log("check");
        console.log(condition);
        console.log(update);
        console.log(wishlist);
        promiseArray.push(runUpdate(condition, update));
      });

      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      //if wishlist not exist then create a new wishlist
      const wishlist = new Wishlist({
        user: req.user._id,
        wishlistItems: req.body.wishlistItems,
      });

      wishlist.save((error, wishlist) => {
        if (error) return res.status(400).json({ error });
        if (wishlist) {
          return res.status(201).json({ wishlist });
        }
      });
    }
  });
};

exports.getWishlistItems = (req, res) => {
  console.log("get wishlist");

  Wishlist.findOne({ user: req.user._id })
    .populate("wishlistItems.product", "_id name price img size color")
    .exec((error, wishlist) => {
      if (error) return res.status(400).json({ error });
      if (wishlist) {
        let wishlistItems = {};

        wishlist.wishlistItems.forEach((item, index) => {
          wishlistItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.name,
            img: item.img,
            size: item.size,
            color: item.color,
            price: item.price,
            qty: item.quantity,
          };
        });
        res.status(200).json({ wishlistItems });
      }
    });
};

// new update remove cart items
exports.removeWishlistItems = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Wishlist.updateOne(
      { user: req.user._id },
      {
        $pull: {
          wishlistItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};
