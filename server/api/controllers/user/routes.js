import express from "express";
import authHandler from "../../middlewares/auth.handler";
import controller from "./controller";

export default express
  .Router()
  .get("/bookings", authHandler, controller.getUserBookings)
  .put("/updateUser", authHandler, controller.updateUser)
  .post("/addRating", authHandler, controller.addRating);
