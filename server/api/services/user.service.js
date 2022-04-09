import { database } from "../../common/firebase";
import l from "../../common/logger";

class UserService {
  userCollectionRef = database.collection("users");
  ratingCollectionRef = database.collection("ratings");
  bookingCollectionRef = database.collection("bookings");

  async updateUser(uid, userData) {
    try {
      const user = await this.userCollectionRef.doc(uid).get();
      if (user.exists) {
        delete userData.id;
        await this.userCollectionRef.doc(uid).update(userData);
        return { message: "User updated successfully" };
      } else {
        throw { status: 402, message: "User not found" };
      }
    } catch (error) {
      l.error("[USER: UPDATE USER]", error);
      throw error;
    }
  }

  async addRating(userId, userName, rating, review, storageId) {
    try {
      const ratingRef = (
        await this.ratingCollectionRef.doc(storageId).get()
      ).data();
      if (ratingRef?.reviews.filter((e) => e.userId === userId).length > 0) {
        throw { status: 402, message: "Already added review" };
      }
      let reviewsToSet = ratingRef?.reviews || [];
      reviewsToSet.push({
        userId,
        userName,
        rating,
        review,
        createdAt: new Date(),
      });
      await this.ratingCollectionRef.doc(storageId).set({
        avgRating: ratingRef
          ? (ratingRef.avgRating + rating) / (ratingRef.totalReviews + 1)
          : rating,
        totalReviews: ratingRef ? ratingRef.totalReviews + 1 : 1,
        reviews: reviewsToSet,
      });
      return { message: "Rating added successfully" };
    } catch (error) {
      l.error("[USER: ADD RATING]", error);
      throw error;
    }
  }

  async getUserBookings(userId) {
    try {
      const bookings = await this.bookingCollectionRef
        .where("userId", "==", userId)
        .get();
      if (bookings.empty) {
        return [];
      }
      return bookings.docs.map((doc) => doc.data());
    } catch (error) {
      l.error("[STORAGE: GET STORAGE BOOKINGS]", error);
      throw error;
    }
  }
}

export default new UserService();
