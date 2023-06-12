const asyncHandler = require("express-async-handler");
const series = require("../models/series");
const video = require("../models/video");

//ANCHOR - Get All Series
exports.getAllSeries = asyncHandler(async (req, res) => {
  try {
    const Series = await series.find({}).exec();
    res.status(200).json({
      type: "Success!",
      message: "Series fetched successfully!",
      data: Series,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Get Series & One series
/*  
@Route /series?id=
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getSeries = asyncHandler(async (req, res) => {
  const { id } = req.query;
  try {
    if (id === "") {
      res.status(400);
      throw new Error("Please make sure to input the Series ID!");
    }
    const Series = await series
      .find(
        (id && {
          _id: id,
        }) || { active: true }
      )
      .populate({
        path: "dataVideo",
        match: { active: true },
        select: id
          ? { __v: 0, active: 0 }
          : { quizTimestamp: 0, miniQuiz: 0, active: 0, __v: 0 },
      })
      .select({
        __v: 0,
        dataVideo: id ? 1 : 0,
      });

    if (Series.length === 0 && id) {
      res.status(400);
      throw new Error("Series not found!");
    }
    res.status(200).json(Series);
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

// ANCHOR Update Series
/*
@Route /series/:id
* Method : PUT
* Access : Admin
*/

exports.updateSeries = asyncHandler(async (req, res) => {
  const data = new series({
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    active: req.body.status,
    dataVideo: req.body.videos,
  });

  try {
    const seriesExist = await series.findOneAndUpdate(
      { "dataVideo._id": data.id },
      data
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

// ANCHOR Delete Series
/*
@Route /series/:id?deleteVideo= true|false
* Method : DELETE
* Access : Admin
*/

exports.deleteSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const seriesExist = await series.findOneAndDelete({ _id: id });
    if (seriesExist) {
      seriesExist.dataVideo.length > 0
        ? await video.deleteMany({ _id: seriesExist.dataVideo }).exec()
        : res.status(200).json({
            message: "Series without video deleted successfully!",
            data: seriesExist,
          });
      res.status(200).json({
        message: "Series with video was deleted successfully!",
        data: seriesExist,
      });
    }
    res.status(400);
    throw new Error("Series is not exist!, please check your Series ID");
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
