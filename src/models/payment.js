const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please add the Payment ID!"],
    },
    transactionId: {
      type: String,
      required: [true, "Please add the transaction ID"],
    },
    link: {
      type: String,
      required: [true, "Please add the payment Link!"],
    },
    idUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    expiredAt: {
      type: Date,
      required: [true, "Please set the expired date!"],
    },
    status: {
      type: String,
      enum: ["active", "closed", "paid"],
      required: [true, "Please add the status!"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", paymentSchema);
