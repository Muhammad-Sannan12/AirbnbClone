const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
exports.getLogin = (req, res, next) => {
  res.render("./auth/login", {
    PageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("./auth/login", {
      PageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: { email },
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("./auth/login", {
      PageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Wrong password"],
      oldInput: { email },

      user: {},
    });
  }
  req.session.user = user;
  await req.session.save();
  req.session.isLoggedIn = true;
  res.redirect("/");
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
exports.getSignup = (req, res, next) => {
  res.render("./auth/signup", {
    PageTitle: "SignUp",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      terms: "",
      user: {},
    },
  });
};
exports.postSignup = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("First name must contain only letters")
    .trim(),
  check("lastName").trim(),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter and one number"
    ),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("User type must be either guest or host"),
  check("terms")
    .isIn(["on"])
    .withMessage("You must accept the terms and conditions"),

  (req, res, next) => {
    const { firstName, lastName, email, userType, password, terms } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("./auth/signup", {
        PageTitle: "SignUp",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
          terms,
        },

        user: {},
      });
    }

    bcrypt.hash(password, 12).then((hashPassword) => {
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        userType,
      });

      user
        .save()
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          return res.status(422).render("./auth/signup", {
            PageTitle: "SignUp",
            currentPage: "signup",
            isLoggedIn: false,
            errors: [err.message],
            oldInput: { firstName, lastName, email, userType, terms },
            user: {},
          });
        });
    });
  },
];
