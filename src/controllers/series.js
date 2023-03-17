const asyncHandler = require("express-async-handler");
const series = require("../models/series");

exports.getAllSeries = asyncHandler(async (req, res) => {
  try {
    const allSeries = await series.find();
    res.status(200).json(allSeries);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});
