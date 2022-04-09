import UserService from "../../services/user.service";

export class Controller {
  async updateUser(req, res, next) {
    try {
      const { userData } = req.body;
      const response = await UserService.updateUser(req.user.uid, userData);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async addRating(req, res, next) {
    try {
      const { rating, review, storageId } = req.body;
      const response = await UserService.addRating(
        req.user.uid,
        req.user.name,
        rating,
        review,
        storageId
      );
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getUserBookings(req, res, next) {
    try {
      const bookings = await UserService.getUserBookings(req.user.uid);
      res.status(200).json({ bookings });
    } catch (error) {
      next(error);
    }
  }
}

export default new Controller();
