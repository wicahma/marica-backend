const asyncHandler = require("express-async-handler");
const waiting = require("../../models/waitingList/");

exports.setWaitingList = asyncHandler(async (req, res) => {
  const { nama, tipe } = req.body;
  const newWaiting = new waiting({
    nama,
    tipe,
  });
  const createdWaiting = await newWaiting.save();
  res.status(201).json(createdWaiting);
});

exports.getWaitingList = asyncHandler(async (req, res) => {
  try {
    const isAnyWaiting = await waiting.find();
    if (isAnyWaiting.length <= 0)
      res.status(400).json({ message: "Tidak ada data waiting!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, internal server error", stack: err });
  }
});

exports.getOneWaitingList = asyncHandler(async (req, res) => {
  try {
    const isWaiting = await waiting.findById(req.params.id);
    if (!isWaiting)
      res.status(400).json({ message: "Data waiting tidak ditemukan!" });
    res.status(200).json(isWaiting);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, internal server error", stack: err });
  }
});
