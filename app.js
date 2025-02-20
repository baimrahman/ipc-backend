const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const ispuRouter = require("./routes/ispu");
const iemsRouter = require("./routes/iems");
const gpRouter = require("./routes/greenport");
const fasilitasRouter = require("./routes/facility");
const ukRouter = require("./routes/ukerja");

const app = express();

const database = require("./services/database");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  cors({
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", usersRouter);
app.use("/api/ispu", ispuRouter);
app.use("/api/iems", iemsRouter);
app.use("/api/gp", gpRouter);
app.use("/api/fasilitas", fasilitasRouter);
app.use("/api/uk", ukRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
