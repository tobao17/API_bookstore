require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
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
//
//
//
//
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
//
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
