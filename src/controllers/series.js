const asyncHandler = require("express-async-handler");
const series = require("../models/series");

// ANCHOR Get All Series
/*  
@Route /series
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getAllSeries = asyncHandler(async (req, res) => {
  try {
    const allSeries = await series.find().select({ __v: 0 });
    res.status(200).json(allSeries);
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Get One Series
/*  
@Route /series/one-series?id=seriesId
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getSeries = asyncHandler(async (req, res) => {
  const { id } = req.query;
  try {
    const seriesExist = await series.findById(id);
    if (seriesExist) {
      res.status(200).json(seriesExist);
    }
    res.status(400);
    throw new Error("Invalid Series Credentials");
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Create Series
/*  
@Route /series
* Method : POST
* Access : Admin
*/

exports.createSeries = asyncHandler(async (req, res) => {
  const { judul, deskripsi, thumbnail } = { ...req.body };

  const newSeries = new series({
    judul: judul,
    deskripsi: deskripsi,
    thumbnail: thumbnail,
  });

  try {
    const seriesExist = await newSeries.save();
    if (seriesExist) {
      res.status(200).json(seriesExist);
    }
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
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
