const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
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
    return res.status(202).json({ msg: `Tài khoản không tồn tại !` });
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
    return res.status(202).json({ msg: `Sai mật khẩu!` });
  }
  if (UserExits.role !== 0) {
    return res.status(202).json({ msg: `Lỗi truy cập! bạn đang ở quyền user` });
  }
  if (bcryptjs.compareSync(password, UserExits.password)) {
    const payload = {
      user: {
        id: UserExits._id,
        username: UserExits.username,
        role: UserExits.role,
      },
    };
    const accessToken = jwt.sign(payload, process.env.jwtkey, {
      expiresIn: "1h",
    });
    return res.status(202).json({ user: UserExits, accessToken: accessToken });
  }
};
