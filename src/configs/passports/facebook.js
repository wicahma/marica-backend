const passport = require("passport");
const { user } = require("../../models/user");
const mongoose = require("mongoose");
const FacebookStrategy = require("passport-facebook").Strategy;

const facebookPassport = () => {
  try {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: "https://api.marica.id/api/v1/auth/facebook/callback",
          profileFields: ["id", "displayName", "photos", "email", "birthday"],
          enableProof: true,
        },
        function verify(accessToken, refreshToken, profile, cb) {
          console.log(profile);
          return cb(null, profile);
        }
      )
    );
    passport.serializeUser(function (user, cb) {
      process.nextTick(function () {
        cb(null, { ...user });
      });
    });

    passport.deserializeUser(function (user, cb) {
      process.nextTick(function () {
        return cb(null, user);
      });
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports = facebookPassport;
