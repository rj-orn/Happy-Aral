const express = require("express");
const mongoose = require("mongoose");

// Google Login
const passport = require("passport");
const session = require("express-session");
require("./passport");



const cors = require("cors");
require("dotenv").config();
// Routes;
const userRoutes = require("./routes/user");
//[SECTION] Activity:
const courseRoutes = require("./routes/course");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
	origin: ["http://localhost:3000"],
	credentials: true,
	optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

// Google Login
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"))


app.use("/users", userRoutes);
app.use("/courses", courseRoutes);



if(require.main === module) {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online at port ${process.env.PORT || 3000}`)
	});
}

module.exports = {app, mongoose}