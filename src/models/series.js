const mongoose = require("mongoose");

const video = new mongoose.Schema({
  videoURL: {
    type: String,
    required: [true, "Please desired to adding video url!"],
  },
  thumbnail: {
    type: String,
    required: [true, "Please add the video thumbnail"],
  },
  quizTimestamp: {
    type: String,
    required: [true, "Please add the timestamp for the quiz!"],
  },
  miniQuiz: {
    tipe: {
      type: String,
      enum: ["pilihanGanda", "fillTheBlank", "reArrange"],
      required: false,
    },
    quiz: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
});

const seriesSchema = mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Please add the title of the series!"],
      maxlength: [100, "Title cannot be more than 100 characters!"],
    },
    deskripsi: {
      type: String,
      required: [true, "Please add the description of the series!"],
      maxlength: [250, "Description cannot be more than 1000 characters!"],
    },
    dataVideo: [video],
  },
  {
    timestamps: true,
  }
);

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

video.path("miniQuiz.tipe").set((v) => {
  console.log({ v });
  const enumValues = video.paths.miniQuiz.tipe.enumValues;
  console.log(enumValues);
  return v;
});

module.exports = mongoose.model("series", seriesSchema);
