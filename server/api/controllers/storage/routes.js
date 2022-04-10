import express from "express";
import authHandler from "../../middlewares/auth.handler";
import controller from "./controller";

export default express
  .Router()
  .get("/getFilteredStorage", authHandler, controller.getFilteredStorages)
  .get("/getStorage", authHandler, controller.getStorage)
  .get("/bookings", authHandler, controller.getStorageBookings)
  .put("/updateStorage", authHandler, controller.updateStorage);
