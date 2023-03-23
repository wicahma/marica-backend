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
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");

router
  .route("/")
  .get(authJWT, getAllUsers)
  .post(createUserOrangtua)
  .put(authJWT, updatePassword)
  .delete(authJWT, deleteUser);
router.route("/:id").put(authJWT, updateUser);
router.route("/login").post(loginUser);
router.route("/re-login/:id").get(authJWT, reLogin);
router
  .route("/:id/anak")
  .post(createUserAnak)
  .put(updateUserAnak)
  .get(getAnak);

module.exports = router;
