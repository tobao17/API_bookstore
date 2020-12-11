const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
module.exports.index = async (req, res) => {
	try {
		var users = await User.find();
		return res.status(200).json(users);
	} catch (error) {
		return res.status(404).json(`error ${error}`);
	}
};

module.exports.create = async (req, res) => {
	const { email, username } = req.body;
	const userNameExist = await User.findOne({ username });
	if (userNameExist) {
		return res.status(202).json(" Tên tài khoản đã tồn tại");
	}
	const userEmailExist = await User.findOne({ email });
	if (userEmailExist) {
		return res.status(202).json("Gmail đăng kí đã tồn tại");
	}
	var hash = bcryptjs.hashSync(req.body.password);
	req.body.password = hash;
	try {
		await User.create(req.body);
		return res.status(201).json("create success");
	} catch (error) {
		return res.status(404).json(`create fail! ${error}`);
	}
};

module.exports.postLogin = async (req, res) => {
	const { username, password } = req.body;
	const UserExits = await User.findOne({ username });

	if (!UserExits) {
		return res.status(202).json({ msg: `Sai tài khoản hoặc mật khẩu !` });
	}
	if (UserExits.wrongLoginCount > 4) {
		return res
			.status(202)
			.json({ msg: `Bạn đã nhập mật khẩu sai quá nhiều lần` });
	}
	if (!bcryptjs.compareSync(password, UserExits.password)) {
		await User.updateOne(
			{ username },
			{
				$inc: {
					wrongLoginCount: 1,
				},
			}
		);
		return res.status(202).json({ msg: `Sai tài khoản hoặc mật khẩu!` });
	}
	// if (UserExits.role !== 0) {
	//   return res.status(202).json({ msg: `Lỗi truy cập! bạn đang ở quyền user` });
	// }
	if (bcryptjs.compareSync(password, UserExits.password)) {
		const payload = {
			user: {
				id: UserExits._id,
				username: UserExits.username,
				role: UserExits.role,
			},
		};
		const { username, address } = UserExits;
		await User.updateOne(
			{ username },
			{
				wrongLoginCount: 0,
			}
		);
		const accessToken = jwt.sign(payload, process.env.jwtkey, {
			expiresIn: "1h",
		});

		return res
			.status(202)
			.json({ username, address, accessToken: accessToken });
	}
};

module.exports.addtoCart = async (req, res) => {
	const productToCart = req.body;
	// 	console.log(productToCart);
	const userId = req.token.user.id;

	try {
		const userCart = await User.findOne({
			_id: userId,
		});
		const isItemAdd = userCart.cart.find(
			(item) => item.book == productToCart.book
		);
		console.log(isItemAdd);
		console.log(productToCart.book);

		if (isItemAdd) {
			await User.updateOne(
				{
					_id: userId,
					"cart.book": productToCart.book,
				},
				{
					$set: {
						"cart.$": {
							...productToCart,
							amount: isItemAdd.amount + productToCart.amount,
						},
					},
				}
			);

			const cart = await User.findOne({
				_id: userId,
			});
			return res.status(200).json({ cart });
		}

		await User.findOneAndUpdate(
			{ _id: userId },
			{
				$push: {
					cart: productToCart,
				},
			}
		);
		const cart = await User.findOne({
			_id: userId,
		});
		return res.status(200).json({ cart });
	} catch (error) {
		return res.status(400).json({
			msd: `your request could not be processed! +${error}`,
		});
	}
};

module.exports.addtoCart2 = async (req, res) => {
	const productToCart = req.body.product;

	const userId = req.token.user.id;
	const userCart = await User.findOne({
		_id: userId,
	});

	try {
		await Promise.all(
			// use promise.all in order to use async await in map
			productToCart.map(async (item) => {
				//	console.log(item);
				const isItemAdd = userCart.cart.find(
					(bookInCart) => bookInCart.book == item.book
				);
				if (isItemAdd) {
					await User.updateOne(
						{
							_id: userId,
							"cart.book": item.book,
						},
						{
							$set: {
								"cart.$": {
									...item,
									amount: isItemAdd.amount + item.amount,
								},
							},
						}
					);
				} else {
					await User.findOneAndUpdate(
						{ _id: userId },
						{
							$push: {
								cart: item,
							},
						}
					);
				}
			})
		);

		const cart = await User.findOne({
			_id: userId,
		});
		return res.status(200).json({ cart });
	} catch (error) {
		return res.status(400).json({
			msd: `your request could not be processed! +${error}`,
		});
	}
};
module.exports.deleteCart = async (req, res) => {
	try {
		const userId = req.token.user.id;

		await User.findOneAndUpdate({ _id: userId }, { cart: [] });
		return res.status(200).json({ msg: `delete success!` });
	} catch (error) {
		return res.status(400).json({ msg: `delete fail!`, error: `${error}` });
	}
};
module.exports.cartUser = async (req, res) => {
	try {
		const userId = req.token.user.id;

		const userCart = await User.findById(userId);
		const { cart } = userCart;

		return res.status(200).json({ msg: `success!`, data: cart });
	} catch (error) {
		return res.status(400).json({ msg: `delete fail!`, error: `${error}` });
	}
};
module.exports.deleteBook = async (req, res) => {
	const userId = req.token.user.id; //get user
	const { bookId } = req.params;
	const user = await User.findById(userId);
	console.log(user);
	try {
		await User.updateOne(
			{ _id: userId },
			{
				$pull: {
					cart: { book: bookId }, //delete product in cart
				},
			}
		);

		return res.status(200).json("delete sussess!");
	} catch (error) {
		return res.status(400).json(`delete fail! ${error}`);
	}
};
