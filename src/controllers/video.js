const asyncHandler = require("express-async-handler");
const series = require("../models/series");
const video = require("../models/video");
const { user } = require("../models/user");
const { default: mongoose } = require("mongoose");

// ANCHOR Get Videos & One Video
/*
@Route /video?id=videoId
* Method : GET
* Access : Orangtua & Admin & Anak
*/

exports.getVideo = asyncHandler(async (req, res) => {
  const { id } = req.query,
    oneVideo = id ? { _id: new mongoose.Types.ObjectId(id) } : {};
  let returnData;

  try {
    const Video = await video
      .aggregate([
        {
          $match: {
            ...oneVideo,
            active: true,
          },
        },
        {
          $project: {
            like: {
              $size: {
                $filter: {
                  input: "$vote",
                  as: "vote",
                  cond: { $eq: ["$$vote.type", "like"] },
                },
              },
            },
            dislike: {
              $size: {
                $filter: {
                  input: "$vote",
                  as: "vote",
                  cond: { $eq: ["$$vote.type", "dislike"] },
                },
              },
            },
            videoURL: 1,
            thumbnail: 1,
            type: 1,
          },
        },
      ])
      .exec();
    if (Video.length === 0 && id) {
      res.status(400);
      throw new Error("Video not found!");
    }
    returnData = id ? { data: { ...Video[0] } } : { data: Video };
    res.status(200).json({
      type: "Success!",
      message: "Video fetched successfully!",
      ...returnData,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Create Video
/*
@Route /video
* Method : POST
* Access : Admin
* Body : videoURL, thumbnail, type
// ?quizTimestamp, ?quizType, ?quiz, ?quizAttachmentType, ?quizAttachmentData
}
*/

exports.createVideo = asyncHandler(async (req, res) => {
  const {
    videoURL,
    thumbnail,
    type,
    quizTimestamp,
    quizType,
    quiz,
    quizAttachmentData,
    quizAttachmentType,
  } = {
    ...req.body,
  };

  const newVideo = new video({
    videoURL: videoURL,
    thumbnail: thumbnail,
    type: type,
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
    // if (seriesID) {
    //   const seriesExist = await series.findById(seriesID);

    //   if (!seriesExist) {
    //     res.status(400);
    //     throw new Error("Invalid Series Credentials!");
    //   }

    //   seriesExist.dataVideo.push(createdVideo._id);
    //   await seriesExist.save();
    // }

    res.status(201).json({
      message: "Video created successfully!",
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

    const deletedVideo = await video.findByIdAndDelete(id);

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

// ANCHOR Like video

exports.likeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params,
    { idAnak } = req.body,
    { type } = req.query,
    { _id } = req.session.user;

  try {
    let likeOperator,
      likeMessage,
      likeType,
      userOperator = {
        $pull: {
          "essentials.dataAnak.$.like": new mongoose.Types.ObjectId(id),
        },
      };
    const hasLiked = await video.findOne({
      _id: id,
      "vote._id": new mongoose.Types.ObjectId(idAnak),
    });

    console.log(hasLiked);

    if (!type && hasLiked) {
      likeOperator = {
        $pull: { vote: { _id: new mongoose.Types.ObjectId(idAnak) } },
      };
      console.log("jalan");
      likeType = "unlike";
      likeMessage = "Video unliked successfully!";
    } else {
      if (type === "dislike") {
        likeOperator = {
          $set: {
            vote: { _id: new mongoose.Types.ObjectId(idAnak), type: "dislike" },
          },
        };
        likeType = "dislike";
        likeMessage = "Video disliked successfully!";
      } else if (type === "like") {
        likeOperator = {
          $set: {
            vote: { _id: new mongoose.Types.ObjectId(idAnak), type: "like" },
          },
        };
        userOperator = {
          $addToSet: {
            "essentials.dataAnak.$.like": new mongoose.Types.ObjectId(id),
          },
        };
        likeType = "like";
        likeMessage = "Video liked successfully!";
      }
    }

    const like = await video
      .updateOne(
        {
          _id: id,
        },
        likeOperator,
        {
          new: true,
          arrayFilters: [{ "likes._id": idAnak }],
        }
      )
      .then(async (likeData) => {
        const userLike = await user.updateOne(
          {
            _id: new mongoose.Types.ObjectId(_id),
            "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak),
          },
          { ...userOperator },
          {
            new: true,
            arrayFilters: [
              {
                "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak),
              },
            ],
          }
        );
        return { video: { ...likeData }, user: { ...userLike } };
      });

    if (like.video.matchedCount === 1 && like.user.matchedCount === 1) {
      return res.status(201).json({
        name: "Success!",
        message: likeMessage,
        data: like,
      });
    }

    res.status(400);
    throw new Error("Invalid Data Input! hint: No video found!");
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
