const Cart = require("../models/cart.model");
const Product = require("../models/book.model");
module.exports.index = async (req, res) => {
  const userId = req.token.user.id;
  try {
    const cart = await Cart.findOne({
      user: userId,
    }).populate("products.product", "-description");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports.add = async (req, res) => {
  const products = req.body.products;
  req.body.user = req.token.user.id;

  try {
    const cartByUser = await Cart.findOne({ user: req.body.user });
    if (cartByUser) {
      const isItemAdd = cartByUser.products.find(
        (item) => item.product == req.body.products.product
      );

      if (isItemAdd) {
        const test = await Cart.findOneAndUpdate(
          {
            user: req.body.user,
            "products.product": req.body.products.product,
          },
          {
            $set: {
              products: {
                ...req.body.products,
                quantity: isItemAdd.quantity + req.body.products.quantity,
              },
            },
          }
        );
        const cart = await Cart.findOne({ user: req.body.user });
        return res.status(200).json({ cart });
      }

      await Cart.findOneAndUpdate(
        { user: req.body.user },
        {
          $push: {
            products: products,
          },
        }
      );
      const cart = await Cart.findOne({ user: req.body.user });

      return res.status(200).json({ cart });
    } else {
      const cartCreate = await Cart.create(req.body);
      return res.status(200).json({
        success: true,
        cartCreate,
      });
    }
  } catch (error) {
    return res.status(400).json({
      msd: `your request could not be processed! +${error}`,
    });
  }
};

module.exports.deleteCart = async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: `delete success!` });
  } catch (error) {
    return res.status(400).json({ msg: `delete fail!`, error: `${error}` });
  }
};
module.exports.deleteBook = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    await Cart.findOneAndUpdate(
      { _id: cartId },
      {
        $pull: {
          product: productId,
        },
      }
    );

    return res.status(200).json("delete sussess!");
  } catch (error) {
    return res.status(400).json("delete fail!");
  }
};
