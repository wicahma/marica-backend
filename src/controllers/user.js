const asyncHandler = require("express-async-handler");
const user = require("../models/user");
const { generateToken, generateValidation } = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../configs/email");

exports.getAllUsers = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    res.status(401);
    throw new Error("No parameter included!, hint: ID");
  }
  try {
    const isAdmin = await user.findById(req.params.id);
    if (!isAdmin || isAdmin.userType !== "admin") {
      res.status(401);
      throw new Error("Not authorized as an admin!");
    }
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.query;
  console.log(identifier);
  console.log(password);
  if (identifier === undefined || password === undefined) {
    res.status(401);
    throw new Error("No parameter included!, hint: identifier or password");
  }

  try {
    const userExist = await user.findOne({
      $or: [{ "essentials.username": identifier }, { email: identifier }],
    });

    if (
      userExist &&
      (await bcrypt.compare(password, userExist.essentials.password))
    ) {
      !userExist.validated
        ? res.status(401).json({
            message:
              "User not validated, please validate your email first to login!",
            email: userExist.email,
          })
        : res.status(200).json({
            ...userExist._doc,
            token: generateToken(user._id),
          });
    } else {
      res.status(400);
      throw new Error("Invalid User Credentials");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

exports.createUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword =
    req.body.password && (await bcrypt.hash(req.body.password, salt));
  // const expAt = Date.now() + 30 * 60 * 1000;

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
    poin: 0,
  };

  const newUser = new user({
    nama: req.body.nama,
    lahir: req.body.lahir,
    email: req.body.email,
    userType: req.body.userType,
    essentials:
      req.body.userType === "admin"
        ? admin
        : req.body.userType === "orangtua"
        ? orangtua
        : anak,
    validated: req.body.userType !== "anak" ? false : true,
  });

  try {
    const createdUser = await newUser.save();
    console.log(createdUser);
    // const newToken = generateToken(createdUser._id);
    const validationCode = generateValidation(
      createdUser._id,
      createdUser.email
    );
    res.status(201).json({
      id: createdUser._doc._id,
      message:
        "User Created, Please check your email for the verification link!",
    });
    sendEmail(
      createdUser._doc.email,
      `http://localhost:4000/user/${validationCode}/validation`
    );
  } catch (err) {
    res.status(400);
    console.log(err);
    throw new Error(err);
  }
});

exports.reLogin = asyncHandler(async (req, res) => {
  console.log(req.body);
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
    res.status(500);
    throw new Error(err);
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const userExist = await user.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (userExist) {
      res.status(200).json(userExist);
    } else {
      res.status(400);
      throw new Error("Invalid User Credentials");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const userExist = await user.findByIdAndDelete(id);
    if (userExist) {
      res.status(200).json({ message: "User deleted successfully!" });
    } else {
      res.status(400);
      throw new Error("No User found in database!");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});
