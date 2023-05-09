const passport = require("passport");
const { user } = require("../../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const googlePassport = () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "https://api.marica.id/api/v1/auth/google/callback",
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

module.exports = googlePassport;
