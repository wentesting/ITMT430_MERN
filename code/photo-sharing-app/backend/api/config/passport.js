const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/Users");
const Admin = require("../models/Admin");
const { config } = require("./env");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      if (jwtPayload.role === "user") {
        User.findById(jwtPayload.id)
          .then((user) => {
            if (user) {
              return done(null, user, "user");
            }
            return done(null, false);
          })
          .catch((err) => console.log(err));
      } else if (jwtPayload.role === "admin") {
        Admin.findById(jwtPayload.id).then((admin) => {
          if (admin) {
            return done(null, admin, "admin");
          }
          return done(null, fasle);
        });
      }
    })
  );
};
