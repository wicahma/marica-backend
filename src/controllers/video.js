const asyncHandler = require("express-async-handler");
const series = require("../models/series");
const video = require("../models/video");
const { user } = require("../models/user");
const { default: mongoose } = require("mongoose");

//ANCHOR - Get All Video
exports.getAllVideo = asyncHandler(async (req, res) => {
  try {
    const Video = await video
      .aggregate([
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
            active: 1,
          },
        },
      ])
      .exec();
    res.status(200).json({
      type: "Success!",
      message: "Video fetched successfully!",
      data: Video,
    });
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

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
      type: "Success!",
      message: "Video deleted successfully!",
      data: {
        isInSeries: isInSeries.matchedCount === 1 ? true : false,
        id: deletedVideo._id,
      },
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
      initOperator,
      likeMessage,
      likeType,
      userOperator = {
        $pull: {
          "essentials.dataAnak.$.like": new mongoose.Types.ObjectId(id),
        },
      };
    // NOTE - find one video that has same
    const hasLiked = await video.findOne({
      _id: new mongoose.Types.ObjectId(id),
      "vote._id": new mongoose.Types.ObjectId(idAnak),
    });

    // NOTE - filter if same data type is exist
    const typeHasLiked =
      hasLiked?.vote.filter(
        (data) => data.type === type && data._id.toString() === idAnak
      ) ?? [];

    console.log("Tipe Like - ", typeHasLiked);

    // NOTE - Check if same data type is exist
    if (typeHasLiked.length !== 0 && type) {
      let message;
      typeHasLiked.length > 1
        ? (message = `Data is already ${typeHasLiked[0].type}d, operation aborted (btw there is a doubled data in your liked video, bug exist goes brrrr)!`)
        : (message = `Data is already ${typeHasLiked[0].type}d, operation aborted!`);
      return res.status(200).json({
        type: `Is ${typeHasLiked[0].type}d!`,
        message: message,
        data: typeHasLiked,
      });
    }

    if (!type && hasLiked) {
      likeOperator = {
        $pull: { vote: { _id: new mongoose.Types.ObjectId(idAnak) } },
      };
      likeType = "unlike";
      likeMessage = "Video unliked successfully!";
    } else {
      initOperator = {
        $pull: { vote: { _id: new mongoose.Types.ObjectId(idAnak) } },
      };
      if (type === "dislike") {
        // hasLiked.vote.length === 0;

        likeOperator = {
          $push: {
            vote: { _id: new mongoose.Types.ObjectId(idAnak), type: "dislike" },
          },
        };
        likeType = "dislike";
        likeMessage = "Video disliked successfully!";
      } else if (type === "like") {
        likeOperator = {
          $push: {
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
        initOperator,
        {
          new: true,
          arrayFilters: [{ "likes._id": idAnak }],
        }
      )
      .then(async (likeData) => {
        const like = await video.updateOne(
          {
            _id: id,
          },
          likeOperator,
          {
            new: true,
            arrayFilters: [{ "likes._id": idAnak }],
          }
        );
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
        return {
          initVideo: { ...likeData },
          video: { ...like },
          user: { ...userLike },
        };
      });

    if (
      like.video.matchedCount === 1 &&
      like.user.matchedCount === 1 &&
      like.initVideo.matchedCount === 1
    ) {
      return res.status(201).json({
        type: "Success!",
        message: likeMessage,
        data: like,
      });
    }

    res.status(400);
    throw new Error(
      "Operation Invalid! hint: No video found / maybe you trying to unlike, but there is no like or dislike data!"
    );
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
