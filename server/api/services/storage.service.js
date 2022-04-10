import { database } from "../../common/firebase";
import l from "../../common/logger";

class StorageService {
  storageCollectionRef = database.collection("storages");
  ratingCollectionRef = database.collection("ratings");
  bookingCollectionRef = database.collection("bookings");

  async getFilteredStorages(filter, values) {
    try {
      const storages = await this.storageCollectionRef
        .where(filter, "in", values)
        .get();
      if (storages.empty) {
        return [];
      }
      let storageData = [];
      for (let storage of storages.docs) {
        const ratings = await this.ratingCollectionRef.doc(storage.id).get();
        storageData.push({
          id: storage.id,
          name: storage.data().name,
          address: storage.data().address,
          pincode: storage.data().pincode,
          email: storage.data().email,
          city: storage.data().city,
          state: storage.data().state,
          location: storage.data().location,
          aadhar: storage.data().aadhar,
          pan: storage.data().pan,
          phone: storage.data().phone,
          images: storage.data().images,
          pricing: storage.data().pricing,
          avgPrice: storage.data().avgPrice,
          tags: storage.data().tags,
          ratings: ratings.empty ? 0 : ratings.data(),
        });
      }
      return storageData;
    } catch (error) {
      l.error("[STORAGE: GET ALL STORAGES BY FILTER]", error);
      throw error;
    }
  }

  async getAllStorages() {
    try {
      const storages = await this.storageCollectionRef.get();
      if (storages.empty) {
        return [];
      }
      let storageData = [];
      for (let storage of storages.docs) {
        const ratings = await this.ratingCollectionRef.doc(storage.id).get();
        storageData.push({
          id: storage.id,
          name: storage.data().name,
          address: storage.data().address,
          pincode: storage.data().pincode,
          email: storage.data().email,
          city: storage.data().city,
          state: storage.data().state,
          location: storage.data().location,
          aadhar: storage.data().aadhar,
          pan: storage.data().pan,
          phone: storage.data().phone,
          images: storage.data().images,
          pricing: storage.data().pricing,
          avgPrice: storage.data().avgPrice,
          tags: storage.data().tags,
          ratings: ratings.empty ? 0 : ratings.data(),
        });
      }
      return storageData;
    } catch (error) {
      l.error("[STORAGE: GET ALL STORAGE DETAILS]", error);
      throw error;
    }
  }

  async updateStorage(uid, storageData) {
    try {
      const storage = await this.storageCollectionRef.doc(uid).get();
      if (storage.exists) {
        delete storageData.id;
        await this.storageCollectionRef.doc(uid).update(storageData);
        return { message: "Storage updated successfully" };
      } else {
        throw { status: 402, message: "Storage not found" };
      }
    } catch (error) {
      l.error("[STORAGE: UPDATE STORAGE]", error);
      throw error;
    }
  }

  async getStorageBookings(storageId) {
    try {
      const bookings = await this.bookingCollectionRef
        .where("storageId", "==", storageId)
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

export default new StorageService();
