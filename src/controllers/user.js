const asyncHandler = require("express-async-handler");
const { user } = require("../models/user");

const { generateToken, generateValidation } = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../configs/email");
const { generateFromEmail } = require("unique-username-generator");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

// * Main User Controller

// ANCHOR Get All Users
/*  
@Route /user
* Method : GET
* Access : Admin
*/

exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Login User
/*  
@Route /user/login
* Method : POST
* Access : Admin, Orangtua
* Body   : identifier (email or username), password
*/

exports.loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    console.log(isError);
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const userExist = await user
      .findOne({
        $or: [{ "essentials.username": identifier }, { email: identifier }],
      })
      .select({
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        "essentials.dataAnak": 0,
      });
    if (!userExist) {
      res.status(400);
      throw new Error("Invalid User Credentials! hint: wrong username/email");
    } else if (await bcrypt.compare(password, userExist.essentials.password)) {
      const token = generateToken(userExist._doc._id.toString());

      return res.status(200).json({
        type: "OK!",
        message: "Login Success!",
        data: {
          ...userExist._doc,
          token: token,
        },
      });
    }

    res.status(400);
    throw new Error("Invalid User Credentials! hint: wrong password");
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Create User Orang Tua
/*  
@Route /user
* Method : POST
* Access : Orangtua
* Body   : email, password
*/

exports.createUserOrangtua = asyncHandler(async (req, res) => {
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    const usernames = generateFromEmail(req.body.email, 2);

    const createdUser = await user.create({
      email: req.body.email,
      nama: req.body.nama,
      userType: "orangtua",
      essentials: {
        username: usernames,
        password: hashedPassword,
      },
      validated: false,
      provider: "local",
    });

    const validationCode = generateValidation(
      createdUser._id,
      createdUser.email
    );
    const mailer = await sendEmail(
      createdUser.email,
      createdUser.nama,
      `https://api.marica.id/user/${validationCode}/validation`
    );
    const token = generateToken(createdUser._doc._id.toString());

    if (!mailer) {
      await user.findByIdAndDelete(createdUser._id);
      res.status(500);
      throw new Error("Email Failed to send!");
    }

    res.status(201).json({
      type: "Created!",
      message:
        "User Created, Please check your email for the verification link!",
      data: {
        ...createdUser._doc,
        token: token,
        mail_status: mailer,
      },
    });
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Re Login
/*  
@Route /user/re-login/:id
* Method : GET
* Access : Orangtua, Admin
* Params : -
*/

exports.reLogin = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;

  if (!_id) {
    res.status(401);
    throw new Error("No parameter included!, hint: ID");
  }

  try {
    const userExist = await user.findById(_id);
    if (userExist) {
      res.status(200).json({
        type: "OK!",
        message: "User Found!",
        data: {
          ...userExist._doc,
        },
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

// ANCHOR Update User
/*  
@Route /user/:id
* Method : PUT
* Access : Orangtua, Admin
* Params : -
* Body   : All User Data
* Session: User ID
*/

exports.updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;

  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  const data = {
    nama: req.body.nama,
    imageID: req.body.imageID,
    lahir: req.body.lahir,
    "essentials.username": req.body.username,
  };

  try {
    const isTaken = await user.findOne({
      "essentials.username": req.body.username,
    });
    if (isTaken && isTaken._id !== _id) {
      res.status(400);
      throw new Error("Username already taken or that is your username sir :)");
    }

    const userExist = await user.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });

    if (userExist) {
      res.status(200).json({
        type: "OK!",
        message: "User Updated!",
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

// ANCHOR Update Password
/*  
@Route /user
* Method : PUT
* Access : Orangtua, Admin
* Body   : id, newPass, oldPass
*/

exports.updatePassword = asyncHandler(async (req, res) => {
  const { newPass, oldPass } = req.body;
  const { _id } = req.session.user;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const isUser = await user.findById(_id);

    if (!isUser) {
      res.status(400);
      throw new Error("Invalid User Credentials! hint : ID");
    } else if (await bcrypt.compare(oldPass, isUser.essentials.password)) {
      const hashedPassword = await bcrypt.hash(newPass, 5);
      await user.findByIdAndUpdate(
        _id,
        {
          "essentials.password": hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        type: "OK!",
        message: "Password updated succesfully!",
      });
    }
    res.status(400);
    throw new Error("Invalid User Credentials! hint : Wrong Password");
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Delete User
/*  
@Route /user
* Method : DELETE
* Access : Orangtua, Admin
* Params : id
*/

exports.deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;

  if (!_id) {
    res.status(400);
    throw new Error("Invalid User Credentials! please check your ID");
  }

  try {
    const userExist = await user.findByIdAndDelete(_id);
    if (userExist) {
      req.session.destroy();
      res.status(200).json({
        type: "OK!",
        message: "User deleted successfully!",
      });
    } else {
      res.status(400);
      throw new Error("No User found in database!");
    }
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR User Logout
/*  
@Route /user/logout
* Method : POST
* Access : Orangtua, Admin
* Params : -
* Body   : -
*/

exports.userLogout = asyncHandler(async (req, res) => {
  req.session.destroy();
  res.status(200).json({
    type: "OK!",
    message: "User logged out successfully!",
  });
});

// ANCHOR Create One User Anak
/*  
@Route /user/:id/anak
* Method : POST
* Access : Orangtua, Admin
* Params : -
* Body   : nama, lahir
*/

exports.createUserAnak = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;
  const isError = validationResult(req);
  console.log("programnya jalan");
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  const newAnak = {
    nama: req.body.nama,
    rentangUsia: req.body.usia,
    poin: 0,
    imageID: "",
    likes: [],
    character: {
      gender: req.body.gender || "male",
      baju: [],
      celana: [],
      aksesorisTangan: [],
      aksesorisKepala: [],
      aksesorisMuka: [],
    },
  };

  try {
    const familyExist = await user.findById(_id);

    if (familyExist && familyExist.userType === "orangtua") {
      await user.findByIdAndUpdate(_id, {
        $push: {
          "essentials.dataAnak": {
            _id: new mongoose.Types.ObjectId(),
            ...newAnak,
          },
        },
      });
      return res.status(200).json({
        type: "OK!",
        message: "Data anak created!",
        data: { ...newAnak },
      });
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

// ANCHOR Update One User Anak
/*  
@Route /user/anak
* Method : PUT
* Access : Orangtua, Admin
* Session: ID Orangtua
* Body   : ?lahir, ?imageID, ?character
*/

exports.updateUserAnak = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;
  const { idAnak } = req.query;

  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      type: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  const dataAnak = {
    $set: {
      "essentials.dataAnak.$.rentangUsia": req.body.usia,
      "essentials.dataAnak.$.nama": req.body.nama,
      "essentials.dataAnak.$.character": req.body.character,
    },
  };

  try {
    const familyExist = await user.findById(_id);

    if (familyExist && familyExist.userType === "orangtua") {
      const isAnak = familyExist.essentials.dataAnak.find(
        (anak) => anak.username === req.body.newUsername
      );

      if (isAnak) {
        res.status(400);
        throw new Error("Username for anak already exist!");
      }

      const updatedUser = await user.updateOne(
        {
          _id: new mongoose.Types.ObjectId(_id),
          "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak),
        },
        { ...dataAnak },
        {
          new: true,
          arrayFilters: [
            { "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak) },
          ],
        }
      );
      if (updatedUser.modifiedCount > 0) {
        return res.status(200).json({
          type: "OK!",
          message: `Data anak updated! ${updatedUser.modifiedCount} Row Updated!`,
        });
      }
      res.status(400);
      throw new Error("Data anak tidak ditemukan!");
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

// ANCHOR Get All Anak From one User
/*  
@Route /user/all-anak
* Method : GET
* Access : Orangtua & Admin
* Session: ID Orangtua
*/

exports.getAllAnak = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;

  try {
    const familyExist = await user.findById(_id);
    if (familyExist && familyExist.userType === "orangtua") {
      res.status(200).json({
        type: "OK!",
        message: "Data anak fetched!",
        data: familyExist.essentials.dataAnak,
      });
    } else {
      res.status(400);
      throw new Error(
        "Invalid User Credentials! hint: No user found/user not Orangtua!"
      );
    }
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Get Anak From one User
/*  
@Route /user/anak?idAnak=id anak
* Method : GET
* Access : Orangtua
* Session: ID Orangtua
* query  : id anak
*/

exports.getAnak = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;
  const { idAnak } = req.query;

  if (!idAnak || !_id) {
    res.status(400);
    throw new Error("No ID provided in query or Session!");
  }

  try {
    const familys = await user.aggregate([
      {
        $unwind: "$essentials.dataAnak",
      },
      {
        $match: {
          $and: [
            { _id: new mongoose.Types.ObjectId(_id) },
            {
              "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak),
            },
          ],
        },
      },
      {
        $limit: 1,
      },
    ]);

    const familyExist = familys[0];

    if (familyExist && familyExist.userType === "orangtua")
      res.status(201).json({
        type: "OK!",
        message: "Data anak fetched!",
        data: familyExist.essentials.dataAnak,
      });

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

// ANCHOR Delete Anak From one User
/*  
@Route /user/anak
* Method : DELETE
* Access : Orangtua
* Session: ID Orangtua
* Query  : id anak
*/

exports.deleteAnak = asyncHandler(async (req, res) => {
  const { _id } = req.session.user;
  const { idAnak } = req.query;

  if (!idAnak || !_id) {
    res.status(400);
    throw new Error("No ID found in query or session!");
  }

  try {
    const familyExist = await user.findById(_id);
    if (familyExist && familyExist.userType === "orangtua") {
      const isUpdated = await user.updateOne(
        {
          _id: _id,
          "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak),
        },
        {
          $pull: {
            "essentials.dataAnak": {
              _id: new mongoose.Types.ObjectId(idAnak),
            },
          },
        }
      );

      if (isUpdated.modifiedCount) {
        return res.status(201).json({
          type: "OK!",
          message: "Anak deleted!",
        });
      }

      res.status(400);
      throw new Error("No Anak found in database!");
    }
    res.status(400);
    throw new Error("Invalid User Credentials! hint: No user found!");
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Get Liked Video
/*
@Route /user/anak/:idAnak/like-history
* Method : GET
* Access : Orangtua, Admin
* Session: ID Orangtua
* Params : idAnak
*/

exports.getLikedVideo = asyncHandler(async (req, res) => {
  const { _id } = req.session.user,
    { idAnak } = req.params;

  console.log(idAnak, _id);

  try {
    const likeHistory = await user.aggregate([
      {
        $unwind: {
          path: "$essentials.dataAnak",
        },
      },
      {
        $match: {
          $and: [
            {
              _id: new mongoose.Types.ObjectId(_id),
            },
            {
              "essentials.dataAnak._id": new mongoose.Types.ObjectId(idAnak),
            },
          ],
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "videos",
          localField: "essentials.dataAnak.like",
          foreignField: "_id",
          as: "likeHistory",
        },
      },
      {
        $project: {
          _id: 0,
          idParent: "$_id",
          idAnak: "$essentials.dataAnak._id",
          nama: "$essentials.dataAnak.nama",
          like: {
            length: {
              $size: "$essentials.dataAnak.like",
            },
            history: "$likeHistory",
          },
        },
      },
    ]);

    if (likeHistory.length) {
      return res.status(200).json({
        type: "Success!",
        message: "Liked Video Fetched!",
        data: likeHistory[0],
      });
    }

    res.status(400);
    throw new Error("Invalid User Data Credentials! hint: No data found!");
  } catch (err) {
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});
