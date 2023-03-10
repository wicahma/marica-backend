const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  loginUser,
  reLogin,
  updateUser,
} = require("../../controllers/user");
const { authJWT } = require("../../middlewares/auth");

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/login/:identifier&:password", loginUser);
router.get("/re-login/:id", authJWT, reLogin);

module.exports = router;
