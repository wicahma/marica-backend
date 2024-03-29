const { body, param } = require("express-validator");

exports.loginValidator = [
  body("identifier")
    .exists()
    .withMessage("Email or Username is required!")
    .isString()
    .withMessage("Identifier must be a string!"),
  body("password")
    .exists()
    .withMessage("Password is required!")
    .isString()
    .withMessage("Password must be a string!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long!"),
];

exports.updateValidator = [
  body("essentials.password")
    .not()
    .exists()
    .withMessage(
      "Password cannot be updated here! hint: use Update Password Routing"
    ),
];

exports.createAnakValidator = [
  body("nama")
    .exists()
    .withMessage("Please Include the Kids name!")
    .isString()
    .withMessage("Nama must be a string!")
    .isLength({ min: 2, max: 100 })
    .toLowerCase(),
  body("usia")
    .exists()
    .withMessage("Please Include the Rentang Usia!")
    .isString()
    .withMessage("Usia must be a string!"),
];

exports.updateAnakValidator = [
  body("nama")
    .isString()
    .withMessage("Nama must be a string!")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nama must be between 2 and 100 characters!"),
  body("usia")
    .isString()
    .withMessage("Usia must in string range '0-4' or '5-8' !")
    .if((value, {}) => (value === "0-4" || value === "5-8" ? true : false)),
  body("character").isObject().withMessage("Character must in object data"),
];

exports.getAnakValidator = [
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isMongoId()
    .withMessage("The ID is not an ID!"),
];

exports.createOrangtuaValidator = [
  body("nama")
    .exists()
    .withMessage("Nama is required!")
    .isLength({ min: 1, max: 50 })
    .withMessage("Nama cannot more than 50!"),
  body("email")
    .exists()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Provide an email with valid format!")
    .isLength({ min: 1, max: 50 })
    .withMessage("Email cannot more than 20!"),
  body("password")
    .exists()
    .withMessage("Password is required!")
    .isStrongPassword()
    .withMessage(
      "Your password is not strong enough! *hint: use 8 characters with minimum 1 uppercase, 1 lowercase, 2 number, 1 symbol"
    )
    .isLength({ min: 8 })
    .withMessage("Please input a password of minimum 5 Characters!"),
];

exports.updatePasswordValidator = [
  body("newPass")
    .exists()
    .withMessage("New Password is required!")
    .isLength({ min: 8 })
    .withMessage("Please input a password of minimum 8 Characters!")
    .isStrongPassword()
    .withMessage("Your password is not strong enough!"),
  body("oldPass")
    .exists()
    .withMessage("Old Password id required!")
    .isLength({ min: 8 })
    .withMessage("Please input a password of minimum 8 Characters!"),
];
