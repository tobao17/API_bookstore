const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const CartItemSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: "books",
	},
	quantity: Number,
	totalPrice: {
		type: Number,
	},
});

// Cart Schema
const CartSchema = new Schema({
	products: [CartItemSchema],
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	updated: { type: Date },
	created: {
		type: Date,
		default: Date.now,
	},
	isComplete: {
		type: Boolean,
		default: false,
	},
	//true if added order
	//
});

module.exports = Mongoose.model("Cart", CartSchema);
