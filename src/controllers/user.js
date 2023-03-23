const asyncHandler = require("express-async-handler");
const { user, anak } = require("../models/user");

const ObjectId = require("mongodb").ObjectId;
const { generateToken, generateValidation } = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../configs/email");
const { generateFromEmail } = require("unique-username-generator");
const { validationResult } = require("express-validator");

// * Main User Controller

// ANCHOR Get All Users
/*  
@Route /user
* Method : GET
* Access : Admin
* Query : ID Admin (id)
*/

exports.getAllUsers = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    res.status(401);
    throw new Error("No parameter included!, hint: ID");
  }
  try {
    const isAdmin = await user.findById(req.query.id);
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
    res.status(400);
    throw {
      name: "Validation Error",
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
        "essentials.password": 0,
        "essentials.dataAnak": 0,
      });
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
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =
      req.body.password && (await bcrypt.hash(req.body.password, salt));
    const username = generateFromEmail(req.body.email, 2);

    const newUser = new user({
      email: req.body.email,
      nama: username,
      userType: "orangtua",
      essentials: {
        username: username,
        password: hashedPassword,
      },
      validated: false,
    });
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

// ANCHOR Re Login
/*  
@Route /user/re-login/:id
* Method : GET
* Access : Orangtua & Admin
* Params : ID user
*/

exports.reLogin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

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

// ANCHOR Update User
/*  
@Route /user/:id
* Method : PUT
* Access : Orangtua & Admin
* Params : ID user
* Body   : All User Data
*/

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // const data = { ...req.body };
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  const data = {
    nama: req.body.nama,
    username: req.body.username,
    imageID: req.body.imageID,
    lahir: req.body.lahir,
    "essentials.username": req.body.username,
  };

  try {
    const isTaken = await user.findOne({
      "essentials.username": req.body.username,
    });
    if (isTaken && isTaken._id != id) {
      res.status(400);
      throw new Error("Username already taken!");
    }

    const userExist = await user.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (userExist) {
      res.status(200).json({ message: "User Updated!" });
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
* Access : Orangtua & Admin
* Body   : id, newPass, oldPass
*/

exports.updatePassword = asyncHandler(async (req, res) => {
  const { newPass, oldPass } = req.body;
  const { id } = req.params;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const isUser = await user.findById(id);
    if (!isUser) {
      res.status(400);
      throw new Error("Invalid User Credentials! hint : ID");
    } else if (await bcrypt.compare(oldPass, isUser.essentials.password)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);
      await user.findByIdAndUpdate(
        id,
        {
          "essentials.password": hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({ message: "Password updated succesfully!" });
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
* Access : Orangtua
* Body   : id
*/

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

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

// ANCHOR Create One User Anak
/*  
@Route /user/:id/anak
* Method : POST
* Access : Orangtua
* Params : ID Orangtua
* Body   : nama, username, ?lahir
*/

exports.createUserAnak = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const users = req;
  console.log(users);
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  const newAnak = {
    nama: req.body.nama,
    lahir: req.body.lahir,
    username: req.body.username,
    poin: 0,
    character: {
      gender: req.body.gender || "male",
    },
  };

  try {
    const familyExist = await user.findById(id);
    const anakExist = familyExist.essentials.dataAnak.find(
      (anak) => anak.username === req.body.username
    );

    if (anakExist) {
      console.log(anakExist);
      res.status(400);
      throw new Error("Username for anak already exist!");
    } else if (familyExist && familyExist.userType === "orangtua") {
      await user.findByIdAndUpdate(id, {
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

// ANCHOR Update One User Anak
/*  
@Route /user/:id/anak
* Method : PUT
* Access : Orangtua
* Params : ID Orangtua
* Body   : ?lahir, ?imageID, username, ?newUsername
*/

exports.updateUserAnak = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.body) {
    res.status(401);
    throw new Error("No parameter included!");
  } else if (!id) {
    res.status(401);
    throw new Error("No ID included!");
  }

  const dataAnak = {
    $set: {
      "essentials.dataAnak.$.username": req.body.newUsername,
      "essentials.dataAnak.$.lahir": req.body.lahir,
      "essentials.dataAnak.$.imageID": req.body.imageID,
    },
  };
  try {
    const familyExist = await user.findById(id);
    const anakExist = familyExist.essentials.dataAnak.find(
      (anak) => anak.username === req.body.newUsername
    );

    if (anakExist) {
      res.status(400);
      throw new Error("Username for anak already exist!");
    } else if (familyExist && familyExist.userType === "orangtua") {
      const updatedUser = await user.updateOne(
        {
          "essentials.username": familyExist.essentials.username,
          "essentials.dataAnak.username": req.body.username,
        },
        { ...dataAnak }
      );
      if (updatedUser.modifiedCount > 0) {
        return res.status(200).json({
          message: "Data anak updated!",
          row_updated: updatedUser.modifiedCount,
        });
      }
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

// ANCHOR Get Anak From one User
/*  
@Route /user/:id/anak?username=namaUsernameAnak
* Method : GET
* Access : Orangtua
* Params : ID Orangtua
*/

exports.getAnak = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username } = req.query;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const familyExist = await user.findById(id);
    if (familyExist && familyExist.userType === "orangtua") {
      if (!username) {
        res.status(201).json(familyExist.essentials.dataAnak);
      }
      const anakExist = familyExist.essentials.dataAnak.find(
        (anak) => anak.username === username
      );
      if (anakExist) {
        return res.status(201).json(anakExist);
      }
      res.status(400);
      throw new Error("No Anak found in database!");
    }
  } catch (err) {
    console.log(err);
    if (!res.status) res.status(500);
    throw new Error(err);
  }
});

// ANCHOR Delete Anak From one User
/*  
@Route /user/:id/anak
* Method : DELETE
* Access : Orangtua
* Params : ID Orangtua
* Query  : ?username anak
*/

exports.deleteAnak = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username } = req.query;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    res.status(400);
    throw {
      name: "Validation Error",
      message: isError.errors[0].msg,
      stack: isError.errors,
    };
  }

  try {
    const familyExist = await user.findById(id);
    if (familyExist && familyExist.userType === "orangtua") {
      const isUpdated = username
        ? await user.updateOne(
            { _id: id, "essentials.dataAnak.username": username },
            { $pull: { "essentials.dataAnak": { username: username } } }
          )
        : await user.updateOne(
            { _id: id, "essentials.dataAnak.username": username },
            {
              $set: { "essentials.dataAnak": [] },
            }
          );
      if (isUpdated.modifiedCount) {
        return res.status(201).json({ message: "Anak deleted!" });
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
