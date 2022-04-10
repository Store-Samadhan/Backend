import crypto from "crypto";
import { nanoid } from "nanoid";
import { razorpayKeySecret } from "../../common/constants";
import { database } from "../../common/firebase";
import l from "../../common/logger";
import razorpayInstance from "../../common/razorpay";

class BookingService {
  storageCollectionRef = database.collection("storages");
  bookingCollectionRef = database.collection("bookings");

  async createBooking(userId, storageId, boxes, amount, storageType, duration, userName) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: (amount * 100).toString(),
        currency: "INR",
        receipt: nanoid(),
      });
      const storage = await this.storageCollectionRef.doc(storageId).get();
      const bookingDocumentRef = await this.bookingCollectionRef.add({
        storageId,
        userId,
        userName,
        storageName: storage.data().name,
        image: storage.data().images ? storage.data().images[0] : "",
        boxes,
        amount,
        address: storage.data().address,
        phone: storage.data().phone,
        storageType,
        orderId: order.id,
        fromDate: new Date(),
        toDate: new Date(
          new Date().getTime() + duration * 7 * 24 * 60 * 60 * 1000
        ),
        paid: false,
      });
      return { orderId: order.id, bookingId: bookingDocumentRef.id };
    } catch (err) {
      l.error("[BOOKING: CREATE BOOKING]", err);
      throw err;
    }
  }

  async verifyBooking(
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    bookingId
  ) {
    try {
      const booking = await this.bookingCollectionRef.doc(bookingId).get();
      if (!booking.exists) {
        throw { status: 402, message: "Order not found, please try again" };
      }
      const paymentOrderId = razorpayOrderId + "|" + razorpayPaymentId;

      const expectedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(paymentOrderId)
        .digest("hex");

      if (expectedSignature === razorpaySignature) {
        await booking.ref.update({
          paid: true,
          paidAt: new Date(),
        });
        return { message: "Payment successfull" };
      }
      throw { status: 402, message: "Payment verification failed" };
    } catch (err) {
      l.error("[BOOKING: VERIFY BOOKING]", err);
      throw err;
    }
  }
}

export default new BookingService();
