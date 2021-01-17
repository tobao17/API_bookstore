const Order = require("../models/order.model");
const Product = require("../models/book.model");
const Bill = require("../models/bill.model");
const User = require("../models/user.model");

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
module.exports.orderDetail = async (req, res) => {
	const OrderId = req.params.id;
	try {
		const myOrder = await Order.findById(OrderId)
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

module.exports.announce = async (req, res) => {
	try {
		const orderAnnounce = await Order.find({ status: 0 }).populate(
			"user",
			"-role -wrongLoginCount -status -wallet -password -cart -createdAt -updatedAt -address"
		);

		return res.status(200).json({
			msd: "success",
			data: orderAnnounce,
		});
	} catch (error) {
		return res.status(400).json({
			msd: "Fail",
		});
	}
};
module.exports.searchOrder = async (req, res) => {
	// console.log(req.body.keyword);
	const searchText = req.body.keyword;
	console.log(searchText);
	try {
		const order = await Order.find({})
			.populate("products.book", "-description -isDelete -quantity")
			.populate(
				"user",
				"-role -wrongLoginCount -status -wallet -password -cart -createdAt -updatedAt -address"
			); //chua toi uu
		const orderSearch = order.filter((item) => {
			if (item.address.includes(searchText)) return item;
			if (item.user.username.includes(searchText)) return item;
			if (item._id.toString().slice(20).includes(searchText)) return item;
		}); // chua toi uu --> lam truoc chay do an--> quay lai sau

		return res.status(200).json({
			msd: "success",
			data: orderSearch,
		});
		//
	} catch (error) {
		return res.status(404).json(`search fail ${error}`);
	}
};
module.exports.add = async (req, res) => {
	req.body.user = req.token.user.id;
	console.log(req.body.user);

	try {
		//	console.log(req.body);
		const order = await Order.create(req.body);
		const user = await User.findOneAndUpdate(
			{ _id: req.body.user },
			{ cart: [] }
		);
		console.log(user);
		return res.status(201).json({ msg: "add order success!", data: order });
	} catch (error) {
		return res.status(400).json({
			msd: `your request could not be processed! +${error}`,
		});
	}
};

module.exports.update = async (req, res) => {
	const { OrderId, status, preStatus } = req.body;
	console.log(preStatus);
	try {
		await Order.updateOne({ _id: OrderId }, { status: status });
		const OrderUpdate = await Order.findById(OrderId)
			.populate("products.book", "-description -isDelete -quantity")
			.populate(
				"user",
				"-role -wrongLoginCount -status -wallet -password -cart -createdAt -updatedAt -address"
			);

		console.log(OrderUpdate);
		if (status == 1) {
			//	const orderComplete = await Order.findById(OrderId);
			await Bill.create({ ...req.body, Order: OrderId });
			//	console.log(orderComplete);
			const { products } = OrderUpdate;
			decreaseQuantity(products);
		}

		if (status == 3 && preStatus == 1) {
			//khach hang bung hang
			const { products } = OrderUpdate;
			IncQuantity(products);
		}
		return res
			.status(200)
			.json({ msg: `update success!`, data: OrderUpdate });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: `update fail!`, error: `${error}` });
	}
};
const decreaseQuantity = (products) => {
	let bulkOptions = products.map((item) => {
		// truyen vao mot mảng pro duct
		return {
			updateOne: {
				filter: { _id: item.book }, // lay ra id
				update: { $inc: { quantity: -item.quantity } }, // how update??
			},
		};
	});

	Product.bulkWrite(bulkOptions); // goi product truyen bulkWrite
};
const IncQuantity = (products) => {
	let bulkOptions = products.map((item) => {
		// truyen vao mot mảng pro duct
		return {
			updateOne: {
				filter: { _id: item.book }, // lay ra id
				update: { $inc: { quantity: +item.quantity } }, // how update??
			},
		};
	});

	Product.bulkWrite(bulkOptions); // goi product truyen bulkWrite
};
