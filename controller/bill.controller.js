const Order = require("../models/order.model");
const Product = require("../models/book.model");
const Bill = require("../models/bill.model");

module.exports.index = async (req, res) => {
	try {
		// qua nhieu du lieu thua
		const bill = await Bill.find().populate("Order");

		return res.status(200).json({
			msd: "success",
			data: bill,
		});
	} catch (error) {
		return res.status(404).json(`error ${error}`);
	}
};
// module.exports.searchBill = async (req, res) => {
// 	const searchText = req.body.keyword.toUpperCase();

// 	try {
// 		const bills = await Bill.find().populate("Order");
// 		// const orderSearch = await bills.filter((item) => {
// 		// 	if (item.address.toUpperCase().includes(searchText)) return item;
// 		// 	if (item.user.username.toUpperCase().includes(searchText)) return item;
// 		// 	if (item._id.toString().toUpperCase().slice(20).includes(searchText))
// 		// 		return item;
// 		// }); // chua toi uu --> lam truoc chay do an--> quay lai sau
// 		console.log(orderSearch);
// 		return res.status(200).json({
// 			msd: "success",
// 			data: orderSearch,
// 		});
// 		//
// 	} catch (error) {
// 		return res.status(404).json(`search fail ${error}`);
// 	}
// };

module.exports.delete = async (req, res) => {
	const BillId = req.params.billId;

	try {
		const bill = await Bill.findByIdAndDelete(BillId);

		return res.status(200).json({
			msd: " delete success",
			data: bill,
		});
	} catch (error) {
		return res.status(404).json(`error ${error}`);
	}
};

module.exports.add = async (req, res) => {
	const OrderId = req.params.id;

	try {
		await Order.findOneAndUpdate({ _id: OrderId }, { status: 1 });
		const orderComplete = await Order.findById(OrderId);

		await Bill.create({ Order: OrderId });
		//	console.log(orderComplete);
		const { products } = orderComplete;
		console.log(products);
		decreaseQuantity(products);
		return res.status(200).json({ msg: ` success!`, orderComplete });
	} catch (error) {
		return res.status(400).json({ msg: ` fail!`, error: `${error}` });
	}
};

//chu xu ly xong  bill xoa ???

//fix loii 404 ???

module.exports.deleteOrder = async (req, res) => {
	const OrderId = req.params.id;

	try {
		const OrderDeltete = await Order.findOne({ _id: OrderId });
		const { products } = OrderDeltete;
		await Bill.deleteOne({ Order: OrderId });
		IncQuantity(products);
		return res.status(200).json("delete success!");
	} catch (error) {
		return res.status(400).json(`delete fail! +${error}`);
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
		return {
			updateOne: {
				filter: { _id: item.product },
				update: { $inc: { quantity: +item.quantity } },
			},
		};
	});
	Product.bulkWrite(bulkOptions);
};
