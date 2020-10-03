const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  address: String,
  totalrice: Number,
  created: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
    default: 0,
  },
  // 0: seller chưa xác nhận,
  // 1: hoàn thành đơn hàng thành công,
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
