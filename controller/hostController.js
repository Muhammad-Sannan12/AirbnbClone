const Home = require("../model/home");
const fs = require("fs");
exports.getAddHome = (req, res, next) => {
  res.render("./host/edit_home", {
    PageTitle: "Add Home",
    currentPage: "add_home",
    editing: false,
    isLoggedIn: req.isLoggedIn, // This indicates that we are adding a new home
    user: req.session.user,
  });
};
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editting === "true";
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("./host/edit_home");
    }
    console.log(homeId, editing, home);
    res.render("./host/edit_home", {
      home: home,
      PageTitle: "Edit Home",
      currentPage: "add_home",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect("/host/host_home_list");
  });
};
exports.postAddHome = (req, res, next) => {
  const { houseName, Location, rating, price, description } = req.body;
  const photo = req.file.path;
  const home = new Home({
    houseName,
    Location,
    rating,
    price,
    photo,
    description,
  });
  home.save().then(() => {
    console.log("Home added successfully");
  });
  res.redirect("/host/host_home_list");
};
exports.postEditHome = (req, res, next) => {
  const { houseName, Location, rating, price, description, _id } = req.body;

  Home.findById(_id)
    .then((home) => {
      home.houseName = houseName;
      home.Location = Location;
      home.rating = rating;
      home.price = price;

      home.description = description;
      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
        home.photo = req.file.path;
      }
      return home.save().then(() => {
        res.redirect("/host/host_home_list");
      });
    })
    .catch((err) => {
      console.error("Error updating home:", err);
      res.redirect("/host/host_home_list");
    });
};
exports.getHostHome = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("./host/host_home_list", {
      registeredHomes: registeredHomes,
      PageTitle: "Host Home list",
      currentPage: "host_home_list",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};
