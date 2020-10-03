const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/book.model");
module.exports.add = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.body.cart });
    if (!cart) {
      return res.status(400).json({ msd: "add order fail!" });
    }
    if (cart.isComplete) {
      return res.status(400).json({ msd: "add order fail!" });
    }

    const { products } = cart;

    await Order.create(req.body);
    await Cart.findOneAndUpdate(
      { _id: req.body.cart },
      {
        $set: {
          isComplete: true,
        },
      }
    );

    await decreaseQuantity(products);
    return res.status(200).json({ msd: "add order success!" });
  } catch (error) {
    return res.status(400).json(error);
  }
};
module.exports.deleteOrder = async (req, res) => {
  try {
    console.log(req.params.id);
    const OrderDeltete = await Order.findOne({ _id: req.params.id }).populate(
      "cart"
    );
    OrderDeltete.deleteOne();
    OrderDeltete.save();
    const { cart } = OrderDeltete;
    const { _id, products } = cart;
    await Cart.deleteOne({ _id });

    subQuantity(products);
    return res.status(200).json("delete success!");
  } catch (error) {
    return res.status(400).json(`delete fail! +${error}`);
  }
};

const decreaseQuantity = (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};
const subQuantity = (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: +item.quantity } },
      },
    };
  });
  Product.bulkWrite(bulkOptions);
};
