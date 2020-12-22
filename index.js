require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// sgMail.setApiKey(
// 	"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"
// );

// const message = {
// 	to: "samuraiguyyyy@gmail.com",
// 	from: "phamtobao99@gmail.com",
// 	subject: "hello from sendgrid",
// 	text: "hello pro!",
// };
// sgMail.send(message, function (err, info) {
// 	if (err) console.log(err);
// 	else console.log("thanh cong gui ");
// });
mongoose
	.connect(process.env.Mongo_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.error(`Connection failed...`, err));
mongoose.set("useFindAndModify", false);

//
//
//
//

app.use(cors());
const bookRouter = require("./router/book.router");
const categoriesRouter = require("./router/categories.router");
const userRouter = require("./router/user.router");
const cartRouter = require("./router/cart.router");
const orderRouter = require("./router/order.router");
const billRouter = require("./router/bill.router");
const testjwtRouter = require("./router/testjwt.router");
const sendmail = require("./middleware/sendMail.middleware");
//
//
//
//
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
//

app.get("/", async (req, res) => {
	sendmail.sendMail(null, null);
	//	const { email } = req.body;
	// create reusable transporter object using the default SMTP transport

	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account

	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

	res.send("Email Sent!");
});

app.use("/books", bookRouter);
app.use("/categori", categoriesRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/bill", billRouter);
app.use("/testjwt", testjwtRouter);

var port = process.env.PORT || 3001;
// listen for requests :)
app.listen(port, () => {
	console.log("Server listening on port " + port);
});
