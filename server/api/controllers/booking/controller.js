import BookingService from "../../services/booking.service";

export class Controller {
  async createBooking(req, res, next) {
    try {
      const { storageId, boxes, amount, storageType, duration, userName } =
        req.body;
      if (!storageId || !boxes || !amount || !storageType || !duration || !userName) {
        throw { status: 402, message: "Missing required fields" };
      }
      const reponse = await BookingService.createBooking(
        req.user.uid,
        storageId,
        boxes,
        amount,
        storageType,
        duration,
        userName
      );
      res.status(200).json(reponse);
    } catch (error) {
      next(error);
    }
  }

  async verifyBooking(req, res, next) {
    try {
      const { razorpayPaymentId, razorpaySignature, orderId, bookingId } =
        req.body;
      if (!razorpayPaymentId || !razorpaySignature || !orderId || !bookingId) {
        throw { status: 402, message: "Payment verification failed" };
      }
      const response = await BookingService.verifyBooking(
        razorpayPaymentId,
        orderId,
        razorpaySignature,
        bookingId
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new Controller();
