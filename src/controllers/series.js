const asyncHandler = require("express-async-handler");
const series = require("../models/series");

exports.getAllSeries = asyncHandler(async (req, res) => {
  try {
    const allSeries = await series.find().select({ _id: 1, __v: 0 });
    res.status(200).json(allSeries);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

exports.getSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const seriesExist = await series.findById(id).project({ _id: 0, __v: 0 });
    if (seriesExist) {
      res.status(200).json(seriesExist);
    } else {
      res.status(400);
      throw new Error("Invalid Series Credentials");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

exports.createSeries = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  try {
    const seriesExist = await series.create(data);
    if (seriesExist) {
      res.status(200).json(seriesExist);
    } else {
      console.log.log(seriesExist);
      res.status(400);
      throw new Error("Invalid Series Credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error(err);
  }
});

exports.updateSeries = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  try {
    const seriesExist = await series.findOneAndUpdate(
      { "dataVideo._id": data.id },
      { data }
    );
    if (seriesExist) {
      res.status(200).json(seriesExist);
    } else {
      res.status(400);
      throw new Error("Invalid Series Credentials");
    }
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
