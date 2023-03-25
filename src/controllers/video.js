const asyncHandler = require("express-async-handler");
const series = require("../models/series");
const video = require("../models/video");
const { user } = require("../models/user");

// ANCHOR Get Videos & One Video
/*
@Route /video?id=videoId
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getVideo = asyncHandler(async (req, res) => {
  const { id } = req.query;
  try {
    const Video = await video
      .find(
        id && {
          _id: id,
          active: true,
        }
      )
      .select({
        __v: 0,
        active: 0,
      })
      .select({
        miniQuiz: id ? 1 : 0,
      });
    if (Video.length === 0 && id) {
      res.status(400);
      throw new Error("Video not found!");
    }
    res.status(200).json(Video);
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Create Video
/*
@Route /video?seriesID=seriesId
* Method : POST
* Access : Admin
* Body : videoURL, thumbnail, ?quizTimestamp, ?quizType, ?quiz, ?quizAttachmentType, ?quizAttachmentData

*quiz = {

}
*/

exports.createVideo = asyncHandler(async (req, res) => {
  const {
    videoURL,
    quizTimestamp,
    quizType,
    quiz,
    quizAttachmentType,
    quizAttachmentData,
    thumbnail,
  } = {
    ...req.body,
  };
  const { seriesID } = req.query;

  const newVideo = new video({
    videoURL: videoURL,
    thumbnail: thumbnail,
    "miniQuiz.quizTimestamp": quizTimestamp,
    "miniQuiz.tipe": quizType,
    "miniQuiz.quiz": {
      attachment: {
        tipe: quizAttachmentType,
        data: quizAttachmentData,
      },
      ...(typeof quiz !== "object" ? JSON.parse(quiz) : quiz),
    },
  });
  try {
    const createdVideo = await newVideo.save();

    if (!createdVideo) {
      res.status(500);
      throw new Error("Video creation failed, internal server error!");
    }
    if (seriesID) {
      const seriesExist = await series.findById(seriesID);

      if (!seriesExist) {
        res.status(400);
        throw new Error("Invalid Series Credentials!");
      }

      seriesExist.dataVideo.push(createdVideo._id);
      await seriesExist.save();
    }

    res.status(201).json({
      message: `Video created successfully!${
        seriesID && ", Series updated succesfully!"
      }`,
      id: createdVideo._id,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Update Video
/*
@Route /video?id=videoId
* Method : PUT
* Access : Admin
* Body : videoURL, thumbnail, quizTimestamp, quizType, quiz, quizAttachmentType, quizAttachmentData
*/

exports.updateVideo = asyncHandler(async (req, res) => {
  const {
    quizTimestamp,
    quizType,
    quiz,
    quizAttachmentType,
    quizAttachmentData,
    thumbnail,
  } = req.body;
  const { id } = req.params;
  try {
    const updatedVideo = await video.findByIdAndUpdate(
      id,
      {
        thumbnail: thumbnail,
        "miniQuiz.quizTimestamp": quizTimestamp,
        "miniQuiz.tipe": quizType,
        "miniQuiz.quiz": {
          attachment: {
            tipe: quizAttachmentType,
            data: quizAttachmentData,
          },
          ...(typeof quiz !== "object" ? JSON.parse(quiz) : quiz),
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedVideo);
    if (!updatedVideo) {
      res.status(500);
      throw new Error("Video update failed, internal server error!");
    }
    res.status(200).json({
      message: "Video updated successfully!",
      id: updatedVideo._id,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Delete Video
/*
@Route /video/:id
* Method : DELETE
* Access : Admin
*/

exports.deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const isInSeries = await series.updateOne(
      {
        dataVideo: id,
      },
      {
        $pull: {
          dataVideo: { $in: id },
        },
      }
    );
    console.log(isInSeries);

    const deletedVideo = await video.findByIdAndDelete(id);

    console.log(deletedVideo);
    if (!deletedVideo) {
      res.status(500);
      throw new Error("Video delete failed, please check the ID!");
    }
    res.status(200).json({
      message: "Video deleted successfully!",
      isInSeries: isInSeries.matchedCount === 1 ? true : false,
      id: deletedVideo._id,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
