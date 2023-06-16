const asyncHandler = require("express-async-handler");
const series = require("../models/series");
const video = require("../models/video");
const { deleteFile } = require("../middlewares/multer");

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

    const withID = id ? { _id: id, active: true } : { active: true };

    const Series = await series
      .find(withID)
      .populate({
        path: "dataVideo",
        // match: { active: true },
        select: {
          title: 1,
          thumbnail: 1,
          type: 1,
        },
      })
      .select({
        judul: 1,
        deskripsi: 1,
        thumbnail: 1,
        createdAt: 1,
        dataVideo: 1,
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
  const { judul, deskripsi, videos } = { ...req.body };

  const newSeries = new series({
    judul: judul,
    deskripsi: deskripsi,
    thumbnail: req.file.filename,
    dataVideo: videos,
  });

  try {
    if (!req.file) {
      res.status(400);
      dataVideo;
      throw new Error("File tidak terinput!");
    }

    const seriesExist = await newSeries.save();

    if (!seriesExist) {
      deleteFile(req.file.path);
      res.status(500);
      throw new Error("Series gagal dibuat!");
    }

    res.status(200).json({
      type: "Created!",
      message: "Series berhasil dibuat!",
      data: seriesExist,
    });
  } catch (err) {
    deleteFile(req.file.path);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Update Image Series
/*
@Route /series/image/:id
* Method : PUT
* Access : Admin
*/

exports.updateImageSeries = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("File tidak terinput!");
    }

    const findSeries = await series.findById(req.params.id);

    const updatedSeries = await series.findByIdAndUpdate(
      req.params.id,
      {
        thumbnail: req.file.filename,
      },
      {
        new: true,
      }
    );

    if (!updatedSeries) {
      deleteFile(req.file.path);
      res.status(500);
      throw new Error("Series update image failed, internal server error!");
    }

    req.file &&
      deleteFile(`${__dirname}/../../public/images/${findSeries.thumbnail}`);

    res.status(200).json({
      message: "Data image updated successfully!",
      id: updatedSeries._id,
    });
  } catch (err) {
    deleteFile(req.file.path);
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
  try {
    const data = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      active: req.body.active,
      dataVideo: req.body.videos,
    };

    const seriesExist = await series.findOneAndUpdate(
      { _id: req.params.id },
      data
    );

    if (!seriesExist) {
      res.status(400);
      throw new Error("Invalid Series Credentials");
    }

    res.status(200).json({
      type: "Updated!",
      message: "Series updated successfully!",
      data: seriesExist,
    });
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
