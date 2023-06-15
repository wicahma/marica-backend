const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please add the Payment ID!"],
    },
    event: {
      type: String,
      required: [true, "Please add the Event Name!"],
    },
    data: {
      type: Object,
      required: [true, "Please add the Payment Data!"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", paymentSchema);
