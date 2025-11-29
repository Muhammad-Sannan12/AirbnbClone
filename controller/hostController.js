const Home = require("../model/home");
const fs = require("fs");
const supabase = require("../supabaseClient.js");
exports.postEditHomeforImage = async (req, res, next) => {};
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
exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, Location, rating, price, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.send("Please upload an image");
    }

    const fileName = Date.now() + "_" + file.originalname;

    // Upload image to Supabase
    const { data, error } = await supabase.storage
      .from("test")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return res.send("Error uploading image");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("test")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Save to database
    const home = new Home({
      houseName,
      Location,
      rating,
      price,
      description,
      photo: imageUrl, // store Supabase URL
    });

    await home.save();

    console.log("Home saved with image");
    res.redirect("/host/host_home_list");
  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
};
exports.postEditHome = async (req, res) => {
  const { houseName, Location, rating, price, description, _id } = req.body;

  try {
    const home = await Home.findById(_id);

    home.houseName = houseName;
    home.Location = Location;
    home.rating = rating;
    home.price = price;
    home.description = description;

    if (req.file) {
      // Upload new image to Supabase
      const fileName = Date.now() + "_" + req.file.originalname;
      const { data, error } = await supabase.storage
        .from("test")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      const { data: urlData } = supabase.storage
        .from("test")
        .getPublicUrl(fileName);

      home.photo = urlData.publicUrl; // new image
    }

    await home.save();
    res.redirect("/host/host_home_list");
  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
};

// exports.postEditHome = (req, res, next) => {
//   const { houseName, Location, rating, price, description, _id } = req.body;

//   Home.findById(_id)
//     .then((home) => {
//       home.houseName = houseName;
//       home.Location = Location;
//       home.rating = rating;
//       home.price = price;

//       home.description = description;
//       if (req.file) {
//         fs.unlink(home.photo, (err) => {
//           if (err) {
//             console.error("Error deleting file:", err);
//           }
//         });
//         home.photo = req.file.path;
//       }
//       return home.save().then(() => {
//         res.redirect("/host/host_home_list");
//       });
//     })
//     .catch((err) => {
//       console.error("Error updating home:", err);
//       res.redirect("/host/host_home_list");
//     });
// };
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
