const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  loginUser,
  reLogin,
  updateUser,
  deleteUser,
  updatePassword,
  createUserOrangtua,
  createUserAnak,
  updateUserAnak,
  getAnak,
  deleteAnak,
  getAllAnak,
  userLogout,
  getLikedVideo,
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");
const {
  loginValidator,
  createAnakValidator,
  getAnakValidator,
  createOrangtuaValidator,
  updatePasswordValidator,
  updateValidator,
  updateAnakValidator,
} = require("./validator/user");
const { sessionChecker } = require("../middlewares/session-checker");

router.route("/login").post(loginValidator, loginUser);

router
  .route("/")
  .post(createOrangtuaValidator, createUserOrangtua)
  .put(
    updateValidator,
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    updateUser
  )
  .delete(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: false }),
    deleteUser
  );

router
  .route("/re-login")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: false }),
    reLogin
  );

router
  .route("/all")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    getAllUsers
  );

router
  .route("/password")
  .put(
    updatePasswordValidator,
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    updatePassword
  );

router
  .route("/logout")
  .delete(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: false }),
    userLogout
  );

//NOTE - Anak Routes

router
  .route("/anak")
  .post(
    createAnakValidator,
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: false }),
    createUserAnak
  )
  .put(
    updateAnakValidator,
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    updateUserAnak
  )
  .get(getAnakValidator, authJWT, sessionChecker, getAnak)
  .delete(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    deleteAnak
  );

router
  .route("/anak/:idAnak/like-history")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    getLikedVideo
  );

router
  .route("/all-anak")
  .get(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    getAllAnak
  );

module.exports = router;
