const asyncHandler = require("express-async-handler");
const user = require("../../models/user");
const { generateToken } = require("../../middlewares/auth");
const bcrypt = require("bcryptjs");

exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.params;
  try {
    const userExist = await user.findOne({
      $or: [{ "essentials.username": identifier }, { email: identifier }],
    });

    if (
      userExist &&
      (await bcrypt.compare(password, userExist.essentials.password))
    ) {
      res.status(200).json({
        ...userExist._doc,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Credentials");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.createUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = {
    username: req.body.username,
    password: hashedPassword,
  };
  const orangtua = {
    username: req.body.username,
    password: hashedPassword,
    address: req.body.address,
  };
  const anak = {
    poin: req.body.poin,
  };

  const newUser = new user({
    nama: req.body.nama,
    lahir: req.body.lahir,
    email: req.body.email,
    type: req.body.type,
    essentials:
      req.body.type === "admin"
        ? admin
        : req.body.type === "orangtua"
        ? orangtua
        : anak,
  });

  try {
    const createdUser = await newUser.save();
    const newToken = generateToken(createdUser._id);
    res.status(201).json({ id: createdUser._doc._id, token: newToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.reLogin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const userExist = await user.findById(id);
    if (userExist) {
      res.status(200).json({
        ...userExist._doc,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Credentials");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
