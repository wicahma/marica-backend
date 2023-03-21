const asyncHandler = require("express-async-handler");
const { user, anak } = require("../models/user");

const { generateToken, generateValidation } = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../configs/email");
const { findByIdAndUpdate } = require("../models/series");

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
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    console.log(req.query);
    res.status(401);
    throw new Error("No parameter included!, hint: identifier or password");
  }

  try {
    const userExist = await user
      .findOne({
        $or: [{ "essentials.username": identifier }, { email: identifier }],
      })
      .populate({ path: "essentials.dataAnak", model: "anak" });
    if (!userExist) {
      res.status(400);
      throw new Error("Invalid User Credentials! hint: wrong username/email");
    } else if (bcrypt.compare(password, userExist.essentials.password)) {
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
      throw new Error("Invalid User Credentials! hint: wrong password");
    }
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

exports.createUserOrangtua = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(401);
    throw new Error("No parameter included!");
  } else if (req.body.userType === "admin") {
    res.status(401);
    throw new Error(
      "Creating that user Type not allowed in here! hint : no hint"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword =
    req.body.password && (await bcrypt.hash(req.body.password, salt));

  const newUser = new user({
    nama: req.body.nama,
    lahir: req.body.lahir,
    email: req.body.email,
    userType: req.body.userType,
    essentials: {
      username: req.body.username,
      password: hashedPassword,
      address: req.body.address,
    },
    validated: false,
  });

  try {
    const createdUser = await newUser.save();

    const validationCode = generateValidation(
      createdUser._id,
      createdUser.email
    );
    sendEmail(
      createdUser.email,
      `http://localhost:4000/user/${validationCode}/validation`
    );

    res.status(201).json({
      id: createdUser._doc._id,
      message:
        "User Created, Please check your email for the verification link!",
    });
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
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
      throw new Error("Invalid User Credentials! please check your ID");
    }
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (data.password || data["essentials.password"]) {
    res.status(401);
    throw new Error(
      "Password cannot be updated here! hint: use Update Password Routing"
    );
  }

  try {
    const userExist = await user.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (userExist) {
      res.status(200).json(userExist);
    } else {
      res.status(400);
      throw new Error("Invalid User Credentials! please check your ID");
    }
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { id, newPass, oldPass } = req.body;
  if (!id) {
    res.status(402);
    throw new Error("Invalid User Credentials! hint : ID");
  } else if (!newPass && !oldPass) {
    res.status(402);
    throw new Error("Invalid User Credentials! hint : newPass or oldPass");
  }

  try {
    const isUser = await user.findById(id);
    if (!isUser) {
      res.status(400);
      throw new Error("Invalid User Credentials! hint : ID");
    } else if (bcrypt.compare(oldPass, isUser.essentials.password)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);
      const updatedUser = await user.findByIdAndUpdate(
        id,
        {
          "essentials.password": hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    if (!res.status) res.status(500);
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
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

exports.createUserAnak = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(401);
    throw new Error("No parameter included!");
  }

  const newAnak = new anak({
    nama: req.body.nama,
    lahir: req.body.lahir,
    poin: 0,
  });

  try {
    const familyExist = await user.findById(req.params.id);
    if (familyExist && familyExist.userType === "orangtua") {
      await user.findByIdAndUpdate(req.params.id, {
        $push: { "essentials.dataAnak": newAnak },
      });
      return res
        .status(200)
        .json({ message: "Data anak created!", data: newAnak });
    }

    res.status(400);
    throw new Error(
      "Invalid User Credentials! hint: No user found/user not Orangtua!"
    );
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

exports.updateUserAnak = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.body) {
    res.status(401);
    throw new Error("No parameter included!");
  }
  


  try {
    const familyExist = await user.findById(id);
    if (familyExist && familyExist.userType === "orangtua") {
      user.findByIdAndUpdate(id, { ...req.body, $push: {} });
    }
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
