const express = require("express");
const router = express.Router();

const { authJWT } = require("../middlewares/auth");
const { getAllSeries } = require("../controllers/series");

router.get("/", getAllSeries);

module.exports = router;
