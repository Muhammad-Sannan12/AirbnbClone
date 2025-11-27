const express = require("express");
const app = express();

const session = require("express-session");
const mongodbsession = require("connect-mongodb-session")(session);
const multer = require("multer");
const url =
  "mongodb+srv://sannansherzada7:khan@cluster0.2n1nfr6.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";
const authRouter = require("./routes/authRouter");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootdir = require("./utils/path");
const path = require("path");
const errorController = require("./controller/error");
const { default: mongoose } = require("mongoose");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerOptions = {
  storage,
};

app.use(multer(multerOptions).single("photo"));
app.use(express.static(path.join(rootdir, "public")));
app.use("/uploads", express.static(path.join(rootdir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootdir, "uploads")));
app.use("/store/uploads", express.static(path.join(rootdir, "uploads")));
app.use("/homelist/uploads", express.static(path.join(rootdir, "uploads")));
const store = new mongodbsession({
  uri: url,
  collection: "sessions",
});
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    store,
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use(hostRouter);

app.use(errorController.error404);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB using Mongoose");
    app.listen(3000, () => {
      console.log("Server http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB using Mongoose:", err);
  });
