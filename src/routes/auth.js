const express = require("express");
const passport = require("passport");
const router = express.Router();

//NOTE - Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/user.phonenumbers.read",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/google" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/api/v1/auth/profil");
  }
);

//NOTE - Facebook Auth
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["public_profile", "email", "user_birthday"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/facebook" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/api/v1/auth/profil");
  }
);

router.get("/facebook/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api/v1/auth/profil");
  });
});

//NOTE - Instagram Auth
router.get(
  "/instagram",
  passport.authenticate("instagram", { scope: ["user_profile", "user_media"] })
);

router.get(
  "/instagram/callback",
  passport.authenticate("instagram", {
    failureRedirect: "/api/v1/auth/profil",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/api/v1/auth/profil");
  }
);

//NOTE - Profil
router.get("/profil", (req, res, next) => {
  const session = req.session;
  console.log(session.passport);
  res.status(200).json({ session });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api/v1/auth/profil");
  });
});

module.exports = router;
