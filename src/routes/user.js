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
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");
const {
  loginValidator,
  createAnakValidator,
  getAnakValidator,
  createOrangtuaValidator,
  updatePasswordValidator,
  updateValidator,
} = require("./validator/user");
const { sessionChecker } = require("../middlewares/session-checker");

router.route("/login").post(loginValidator, loginUser);

router
  .route("/")
  .put(updateValidator, authJWT, sessionChecker, updateUser)
  .delete(authJWT, sessionChecker, deleteUser);

router.route("/re-login").get(authJWT, sessionChecker, reLogin);

router
  .route("/anak")
  .post(createAnakValidator, authJWT, sessionChecker, createUserAnak)
  .put(authJWT, sessionChecker, updateUserAnak)
  .get(getAnakValidator, authJWT, sessionChecker, getAnak)
  .delete(authJWT, sessionChecker, deleteAnak);

router.route("/all-anak").get(authJWT, sessionChecker, getAllAnak);

router
  .route("/")
  .get(authJWT, getAllUsers)
  .post(createOrangtuaValidator, createUserOrangtua);

router
  .route("/:id/update-pass")
  .put(updatePasswordValidator, authJWT, sessionChecker, updatePassword);

router.route("/logout").delete(authJWT, sessionChecker, userLogout);

module.exports = router;
