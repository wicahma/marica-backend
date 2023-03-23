const asyncHandler = require("express-async-handler");
const series = require("../models/series");

// ANCHOR Get All Series
/*  
@Route /user
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getAllSeries = asyncHandler(async (req, res) => {
  try {
    const allSeries = await series.find().select({ _id: 1, __v: 0 });
    res.status(200).json(allSeries);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Get One Series
/*  
@Route /user/one-series
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const seriesExist = await series.findById(id).project({ __v: 0 });
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

// ANCHOR Create Series
/*  
@Route /user
* Method : POST
* Access : Admin
*/

exports.createSeries = asyncHandler(async (req, res) => {
  const { judul, deskripsi, idVideo } = { ...req.body };

  const newSeries = new series({
    judul: judul,
    deskripsi: deskripsi,
    dataVideo: idVideo,
  });
  
  try {
    const seriesExist = await newSeries.save();
    if (seriesExist) {
      res.status(200).json(seriesExist);
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
