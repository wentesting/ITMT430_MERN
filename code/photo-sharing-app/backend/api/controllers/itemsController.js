const Controller = require("./controller");
const ObjectId = require("mongoose").Types.ObjectId;
const ImageController = require("./imageController");
class ItemsController extends Controller {
  create(userId, data, callback) {
    data.sellerID = userId;
    data.wishlistedBy = [];
    super.create(data, callback);
  }

  updateBySeller(userId, id, data, callback) {
    if (userId) {
      return this.update(id, data, callback);
    }
  }

  updateByOthers(id, data, callback) {
    if (typeof data != "object" || !data.userId)
      return callback({ status: 400, message: "userId is required" });
    this.find(id, (err, res) => {
      if (err) return callback(err);
      const index = res.wishlistedBy.indexOf(data.userId);
      if (index > -1) res.wishlistedBy.splice(index, 1);
      else res.wishlistedBy.push(data.userId);
      return this.update(id, res, callback);
    });
  }

  getByWishListedBy(userId, callback) {
    if (!userId)
      return callback({ status: 400, message: "userId is required" });
    const query = { wishlistedBy: userId };
    return this.getByQuery(query, callback);
  }

  getBySeller(userId, callback) {
    if (!userId)
      return callback({ status: 400, message: "userId is required" });
    const query = { sellerID: userId };
    console.log("getBySeller with query: " + JSON.stringify(query));
    return this.getByQuery(query, callback);
  }

  async userDelete(params, callback) {
    const query = { _id: ObjectId(params.id), sellerID: params.userId };
    this.findByQuery(query, (err, item) => {
      console.log(item);
      if (err) return callback(err);
      if (!item) return callback(null, { delete: 0 });
      if (item.photoKey) {
        const imageController = new ImageController();
        imageController.delete(item.photoKey, (err, res) => {
          this.deleteOneByQuery(query, callback);
        });
      } else return this.deleteOneByQuery(query, callback);
    });
  }
}

module.exports = ItemsController;
