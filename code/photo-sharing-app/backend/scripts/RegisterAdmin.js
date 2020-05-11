const bcrypt = require("bcryptjs");
const Admin = require("../api/models/Admin");
const Controller = require("../api/controllers/controller");
const AdminController = new Controller(Admin);
require("dotenv").config();

const createAdmin = async () => {
  console.log("Creating default admin...");
  var name = "admin";
  var email = "admin@iitrade.com";
  var password = "admin123";
  var phone = 9998880000;
  var accessCode = "50678";
  var data = {
    name,
    email,
    password,
    phone,
    accessCode,
  };

  Admin.findOne({ email: email }).then(async (admin) => {
    if (admin) {
      console.log("Default admin already exist!");
      console.log(`${email} with access code: ` + admin.accessCode);
    } else {
      const newAdmin = new Admin(data);
      const salt = await bcrypt.genSalt(15);
      const hash = await bcrypt.hash(newAdmin.password, salt);
      newAdmin.password = hash;
      newAdmin.save((err, res) => {
        console.log(res);
      });
      console.log(`Default admin created succesfully`);
    }
  });
};

exports.createAdmin = createAdmin;
