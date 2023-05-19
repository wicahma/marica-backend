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
  .put(updateValidator, authJWT, sessionChecker, updateUser)
  .delete(authJWT, sessionChecker, deleteUser);

router.route("/re-login").get(authJWT, sessionChecker, reLogin);

router
  .route("/all")
  .get(
    authJWT,
    (req, res, next) => sessionChecker(req, res, next, "protected"),
    getAllUsers
  );

router
  .route("/password")
  .put(updatePasswordValidator, authJWT, sessionChecker, updatePassword);

router.route("/logout").delete(authJWT, sessionChecker, userLogout);

//NOTE - Anak Routes

router
  .route("/anak")
  .post(createAnakValidator, authJWT, sessionChecker, createUserAnak)
  .put(updateAnakValidator, authJWT, sessionChecker, updateUserAnak)
  .get(getAnakValidator, authJWT, sessionChecker, getAnak)
  .delete(authJWT, sessionChecker, deleteAnak);

router
  .route("/anak/:idAnak/like-history")
  .get(authJWT, sessionChecker, getLikedVideo);

router.route("/all-anak").get(authJWT, sessionChecker, getAllAnak);

module.exports = router;
