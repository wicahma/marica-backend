const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  loginUser,
  reLogin,
  updateUser,
  deleteUser,
  updatePassword,
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");

router.route("/").get(authJWT, getAllUsers).post(createUser);
router.route("/:id").put(authJWT, updateUser).delete(authJWT, deleteUser);
router.route("/change-pass").put(authJWT, updatePassword);
router.route("/login").get(loginUser);
router.route("/re-login/:id").get(authJWT, reLogin);

module.exports = router;
