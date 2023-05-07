const passport = require("passport");
const { user } = require("../../models/user");
const mongoose = require("mongoose");
const InstagramStrategy = require("passport-instagram");

const instagramPassport = () => {
  try {
    passport.use(
      new InstagramStrategy(
        {
          clientID: process.env.INSTAGRAM_CLIENT_ID,
          clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
          callbackURL: "https://api.marica.id/api/v1/auth/instagram/callback",
          state: true,
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

module.exports = instagramPassport;
