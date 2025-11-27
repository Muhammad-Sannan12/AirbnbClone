const express = require("express");
const storeRouter = express.Router();

const storeController = require("../controller/storeController");
storeRouter.get("/", storeController.getHomes);
storeRouter.get("/store/bookings", storeController.getBookings);
storeRouter.get("/store/favourite_list", storeController.getFavourite);
storeRouter.post("/store/favourite_list", storeController.postAddToFavourite);
storeRouter.get("/store/index", storeController.getIndex);
storeRouter.get("/homelist/:homeId", storeController.getHomeDetails);
storeRouter.post(
  "/store/remove_home/:homeId",
  storeController.postRemoveFavourite
);
module.exports = storeRouter;
