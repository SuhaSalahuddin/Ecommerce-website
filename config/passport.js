const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Buyer = mongoose.model("buyers");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Buyer.findById(jwt_payload.id)
        .then((buyer) => {
          if (buyer) {
            console.log("Passport1");
            return done(null, buyer);
          }
          console.log("Passport2");
          return done(null, false);
        })
        .catch((err) => console.log("passport file: ", err));
    })
  );
};
