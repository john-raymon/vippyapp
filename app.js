require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var isProduction = process.env.NODE_ENV === "production";
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build/")));

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/vippy_dev", { useNewUrlParser: true });
  mongoose.set("debug", true);
}

require("./models/User");
require("./models/Host");
require("./models/Promoter");
require("./models/Event");
require("./models/Listing");
require("./models/Product");
require("./models/Reservation");

require("./config/passport");

app.use("/api", require("./routes/beta_api"));

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// forward 404s to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (isProduction) {
    console.log(err.stack); // print stacktrace
  }
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message || "",
      error: err
    }
  });
});

module.exports = app;
