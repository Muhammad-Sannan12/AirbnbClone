const express = require("express");
const hostRouter = express.Router();

const hostController = require("../controller/hostController");
hostRouter.get("/host/edit_home", hostController.getAddHome);

hostRouter.post("/host/host_home_list", hostController.postAddHome);
hostRouter.get("/host/host_home_list", hostController.getHostHome);
hostRouter.get("/host/edit_home/:homeId", hostController.getEditHome);
hostRouter.post("/host/delete_home/:homeId", hostController.postDeleteHome);
hostRouter.post("/host/edit_home", hostController.postEditHome);
module.exports = hostRouter;
