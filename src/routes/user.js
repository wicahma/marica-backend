const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  loginUser,
  reLogin,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { authJWT } = require("../middlewares/auth");

router.get("/", authJWT, getAllUsers);
router.post("/", createUser);
router.put("/:id", authJWT, updateUser);
router.get("/login", loginUser);
router.get("/re-login/:id", authJWT, reLogin);
router.delete("/:id", authJWT, deleteUser );

module.exports = router;
