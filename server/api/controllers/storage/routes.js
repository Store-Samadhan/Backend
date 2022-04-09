import express from "express";
import authHandler from "../../middlewares/auth.handler";
import controller from "./controller";

export default express
  .Router()
  .get("/getFilteredStorage", controller.getFilteredStorages)
  .get("/bookings", controller.getStorageBookings)
  .put("/updateStorage", controller.updateStorage);
