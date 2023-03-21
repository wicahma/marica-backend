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
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");

router.route("/").get(authJWT, getAllUsers).post(createUserOrangtua);
router.route("/:id").put(authJWT, updateUser).delete(authJWT, deleteUser);
router.route("/change-pass").put(authJWT, updatePassword);
router.route("/login").post(loginUser);
router.route("/:id/anak").post(createUserAnak).put(authJWT, updateUserAnak);
router.route("/re-login/:id").get(authJWT, reLogin);

module.exports = router;
