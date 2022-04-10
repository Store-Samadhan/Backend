import StorageService from "../../services/storage.service";

export class Controller {
  async getFilteredStorages(req, res, next) {
    try {
      const { filter, values } = req.query;
      if (!filter || !values) {
        const response = await StorageService.getAllStorages();
        return res.status(200).json(response);
      }
      const response = await StorageService.getFilteredStorages(filter, values);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateStorage(req, res, next) {
    try {
      const { storageData } = req.body;
      const response = await StorageService.updateStorage(
        req.user.uid,
        storageData
      );
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getStorage(req, res, next) {
    try {
      const { storageId } = req.query;
      if (!storageId) {
        throw { status: 402, message: "Storage ID is required" };
      }
      const response = await StorageService.getStorageDetails(storageId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getStorageBookings(req, res, next) {
    try {
      const bookings = await StorageService.getStorageBookings(req.user.uid);
      res.status(200).json({ bookings });
    } catch (err) {
      next(err);
    }
  }
}

export default new Controller();
