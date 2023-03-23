const mongoose = require("mongoose");


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
    dataVideo: [{
      type: mongoose.Schema.ObjectId,
      ref: "video",
      required: false,
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("series", seriesSchema);
