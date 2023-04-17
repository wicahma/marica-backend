const mongoose = require("mongoose");

const quizType = ["pilihanGanda", "fillTheBlank", "reArrange"];

const videoSchema = new mongoose.Schema({
  videoURL: {
    type: String,
    required: [true, "Please desired to adding video url!"],
  },
  thumbnail: {
    type: String,
    required: [true, "Please add the video thumbnail"],
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  type: {
    type: String,
    enum: ["paid", "free"],
    required: [true, "Please add the video type!"],
  },
  active: {
    type: Boolean,
    required: [true, "Please add the active status!"],
    default: false,
  },
  miniQuiz: {
    tipe: {
      type: String,
      enum: quizType,
      required: false,
    },
    quizTimestamp: {
      type: Number,
      required: [true, "Please add the timestamp in epoch for the quiz!"],
    },
    quiz: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
});

const attachment = new mongoose.Schema({
  tipe: {
    type: String,
    enum: ["image", "audio"],
    required: false,
  },
  data: {
    type: String,
    required: false,
  },
});

const pilihanGanda = new mongoose.Schema({
  attachment: attachment,
  soal: {
    type: String,
    required: [true, "Please add the question!"],
  },
  jawaban: {
    type: [String],
    required: [true, "Please add the answer!"],
    maxlength: [15, "Answer cannot be more than 15 characters!"],
  },
  jawabanBenar: {
    type: String,
    required: [true, "Please add the correct answer!"],
    maxlength: [15, "Answer cannot be more than 15 characters!"],
  },
});

const fillTheBlank = new mongoose.Schema({
  attachment: attachment,
  soal: {
    type: String,
    required: [true, "Please add the question!"],
  },
  jawabanBenar: {
    type: String,
    required: [true, "Please add the correct answer!"],
    maxlength: [15, "Answer cannot be more than 15 characters!"],
  },
});

const reArrange = new mongoose.Schema({
  attachment: attachment,
  soal: {
    type: String,
    required: [true, "Please add the question!"],
  },
  jawabanBenar: {
    type: [String],
    required: [true, "Please add the correct answer!"],
    maxlength: [15, "Answer cannot be more than 15 characters!"],
  },
});

videoSchema.path("miniQuiz.tipe").set((v) => {
  switch (v) {
    case quizType[0]:
      videoSchema.path("dataVideo.miniQuiz.quiz", pilihanGanda);
      break;
    case quizType[1]:
      videoSchema.path("dataVideo.miniQuiz.quiz", fillTheBlank);
      break;
    case quizType[2]:
      videoSchema.path("dataVideo.miniQuiz.quiz", reArrange);
      break;
    default:
      break;
  }
  return v;
});

module.exports = mongoose.model("video", videoSchema);
