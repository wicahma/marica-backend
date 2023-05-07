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
    scope: ["email", "public_profile"],
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

//NOTE - Instagram Auth
router.get(
  "/instagram",
  passport.authenticate("instagram", {
    scope: ["email", "public_profile"],
  })
);

router.get(
  "/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/instagram" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/api/v1/auth/profil");
  }
);

//NOTE - Profil
router.get("/profil", function (req, res, next) {
  const session = req.session;
  console.log(session.passport);
  res.status(200).json({ session });
});

module.exports = router;
