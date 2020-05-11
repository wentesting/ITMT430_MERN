const Controller = require("./controller");

class UserController extends Controller {
  create(data, callback) {
    this.DBModel.findOne(data, (err, res) => callback(err, res));
  }
}
