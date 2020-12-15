const Order = require("../models/order.model");
const Product = require("../models/book.model");

module.exports.index = async (req, res) => {
	try {
		const orderlist = await Order.find({})
			.populate("products.book", "-description -isDelete -quantity")
			.populate(
				"user",
				"-role -wrongLoginCount -status -wallet -password -cart -createdAt -updatedAt -address"
			)
			.sort({ status: 1 });
		res.status(200).json({ msg: "success!", data: orderlist });
	} catch (error) {
		res.status(400).json(error);
	}
};
module.exports.checkorder = async (req, res) => {
	const userId = req.token.user.id;
	try {
		const myOrder = await Order.find({ user: userId, status: !2 })
			.populate("products.book", "-description -isDelete -quantity")
			.populate(
				"user",
				"-role -wrongLoginCount -status -wallet -password -cart -createdAt -updatedAt -address"
			);
		return res.status(200).json({ msg: ` success!`, data: myOrder });
	} catch (error) {
		return res
			.status(400)
			.json({ msg: `get my order fail!`, error: `${error}` });
	}
};

module.exports.add = async (req, res) => {
	req.body.user = req.token.user.id;

	try {
		console.log(req.body);
		const order = await Order.create(req.body);
		await User.findOneAndUpdate({ _id: req.body.user }, { cart: [] });
		return res.status(201).json({ msg: "add order success!", data: order });
	} catch (error) {
		return res.status(400).json({
			msd: `your request could not be processed! +${error}`,
		});
	}
};

module.exports.deleteOrder = async (req, res) => {
	const OrderId = req.params.id;
	try {
		await Order.updateOne({ _id: OrderId }, { status: 2 });
		return res.status(200).json({ msg: `delete success!` });
	} catch (error) {
		return res.status(400).json({ msg: `delete fail!`, error: `${error}` });
	}
};
