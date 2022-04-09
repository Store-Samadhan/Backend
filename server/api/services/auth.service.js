import { database } from "../../common/firebase";
import l from "../../common/logger";

class AuthService {
  userCollectionRef = database.collection("users");
  storageCollectionRef = database.collection("storages");

  async signupUser(name, phone, email, uid, state, city) {
    try {
      await this.userCollectionRef.doc(uid).set({
        name,
        phone,
        state,
        city,
        email,
        createdAt: new Date(),
      });
      return { message: "User registered successfully" };
    } catch (error) {
      l.error("[SIGNUP SERVICE USER]", error);
      throw error;
    }
  }

  async signupStorage(
    name,
    phone,
    email,
    uid,
    state,
    city,
    pincode,
    address,
    location,
    id
  ) {
    try {
      await this.storageCollectionRef.doc(uid).set({
        id,
        name,
        phone,
        state,
        city,
        email,
        pincode,
        address,
        location,
        createdAt: new Date(),
      });
      return { message: "Storage registered successfully" };
    } catch (error) {
      l.error("[SIGNUP SERVICE STORAGE]", error);
      throw error;
    }
  }

  async getUser(uid) {
    try {
      const user = await this.userCollectionRef.doc(uid).get();
      if (user.exists) {
        return user.data();
      }
      const storage = await this.storageCollectionRef.doc(uid).get();
      if (storage.exists) {
        const datatoReturn = storage.data();
        datatoReturn.isStorage = true;
        return datatoReturn;
      } else {
        throw { status: 402, message: "User not found" };
      }
    } catch (error) {
      l.error("[GET USER]", error);
      throw error;
    }
  }
}

export default new AuthService();
