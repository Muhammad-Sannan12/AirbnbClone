const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const session = require("express-session");
const mongodbsession = require("connect-mongodb-session")(session);
const multer = require("multer");
const url = process.env.MONGO_URI;
const authRouter = require("./routes/authRouter");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const path = require("path");
const errorController = require("./controller/error");
const { default: mongoose } = require("mongoose");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/host/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/store/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/homelist/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 3000;
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

if (!url) {
  console.warn(
    "MONGO_URI not set — starting server without MongoDB connection (read-only views may still render)"
  );
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} (no MongoDB)`);
  });
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB using Mongoose");
      app.listen(PORT, () => {
        console.log("Server URL LINK");
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB using Mongoose:", err);
    });
}
