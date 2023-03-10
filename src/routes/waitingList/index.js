const express = require("express");
const router = express.Router();
const {
  getWaitingList,
  setWaitingList,
  getOneWaitingList,
} = require("../../controllers/user/waitingList.js");

router.get("/", getWaitingList);
router.get("/list/:id", getOneWaitingList);
router.post("/", setWaitingList);

module.exports = router;
