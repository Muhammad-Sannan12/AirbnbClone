const Home = require("../model/home");
const User = require("../model/user");
exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home_list", {
      registeredHomes: registeredHomes,
      PageTitle: "Homes List",
      currentPage: "home_list",
      isLoggedIn: req.isLoggedIn,

      user: req.session.user,
    });
  });
};
exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      PageTitle: "Welcome index",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};
exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    PageTitle: "Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,

    user: req.session.user,
  });
};
exports.getFavourite = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourite");
  res.render("store/favourite_list", {
    favourites: user.favourite,
    PageTitle: "My Favourite",
    currentPage: "favourite",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourite.includes(homeId)) {
    user.favourite.push(homeId);
    await user.save();
  }
  res.redirect("/store/favourite_list");
};
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    res.render("store/home_detail", {
      home: home,
      PageTitle: "Home Details",
      isLoggedIn: req.isLoggedIn,
      currentPage: "home_list",

      user: req.session.user,
    });
  });
};
exports.postRemoveFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourite.includes(homeId)) {
    user.favourite = user.favourite.filter((fav) => fav != homeId);
    await user.save();
  }

  return res.redirect("/store/favourite_list");
};
