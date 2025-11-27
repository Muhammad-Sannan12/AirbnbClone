//core module
const path = require("path");
const fs = require("fs");
const rootDir = require("../utils/path");
const Favourite = require("./favourite");

const filePath = path.join(rootDir, "data", "homes.json");
module.exports = class Home {
  constructor(houseName, Location, rating, price, photo) {
    this.houseName = houseName;
    this.Location = Location;
    this.rating = rating;
    this.price = price;
    this.photo = photo;
  }
  save() {
    Home.find((registeredHomes) => {
      if (this.id) {
        //edit case
        registeredHomes = registeredHomes.map((home) =>
          home._id === this.id ? this : home
        );
      } else {
        //add home case
        this.id = Math.random().toString();
        registeredHomes.push(this);
      }

      fs.writeFile(filePath, JSON.stringify(registeredHomes), (err) => {
        if (err) {
          console.error("Error writing to file", err);
        }
      });
    });
  }
  static find(callback) {
    fs.readFile(filePath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static findById(homeId, callback) {
    this.find((homes) => {
      const homefound = homes.find((home) => home._id === homeId);
      callback(homefound);
    });
  }
  static deleteById(homeId, callback) {
    this.find((homes) => {
      const updatedHomes = homes.filter((home) => home._id !== homeId);
      fs.writeFile(filePath, JSON.stringify(updatedHomes), (err) => {
        Favourite.removeFromFavourite(homeId, callback);
      });
    });
  }
};
