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
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");
const {
  loginValidator,
  deleteValidator,
  reLoginValidator,
  createAnakValidator,
  getAnakValidator,
  deleteAnakValidator,
  createOrangtuaValidator,
  updatePasswordValidator,
} = require("./validator/user");
const { sessionChecker } = require("../middlewares/session-checker");

router.route("/login").post(loginValidator, loginUser);
router
  .route("/:id")
  .put(authJWT, updateUser)
  .delete(deleteValidator, authJWT, deleteUser);
router
  .route("/re-login/:id")
  .get(reLoginValidator, authJWT, sessionChecker, reLogin);
router
  .route("/:id/anak")
  .post(createAnakValidator, authJWT, createUserAnak)
  .put(authJWT, updateUserAnak)
  .get(getAnakValidator, authJWT, getAnak)
  .delete(deleteAnakValidator, authJWT, deleteAnak);
router
  .route("/")
  .get(authJWT, getAllUsers)
  .post(createOrangtuaValidator, createUserOrangtua);
router
  .route("/:id/update-pass")
  .put(updatePasswordValidator, authJWT, updatePassword);

module.exports = router;
