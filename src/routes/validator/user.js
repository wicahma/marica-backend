const { body, param } = require("express-validator");

exports.loginValidator = [
  body("identifier").exists().withMessage("Email or Username is required!"),
  body("password")
    .exists()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long!"),
];

exports.updateValidator = [
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isLength({ min: 24 })
    .withMessage("The ID is not an ID!"),
  body("essentials.password")
    .not()
    .exists()
    .withMessage(
      "Password cannot be updated here! hint: use Update Password Routing"
    ),
];

exports.deleteValidator = [
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isLength({ min: 24 })
    .withMessage("The ID is not an ID!"),
];

exports.reLoginValidator = [
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isLength({ min: 24 })
    .withMessage("The ID is not an ID!"),
];

exports.createAnakValidator = [
  body("nama")
    .exists()
    .withMessage("Please Include the Kids name!")
    .isLength({ min: 2, max: 100 })
    .toLowerCase(),
  body("lahir")
    .exists()
    .withMessage("Please Include the Birth date!")
    .isDate({ strictMode: false })
    .withMessage("Please input a valid date!"),
  body("username")
    .exists()
    .withMessage("Please Include the username for kids!")
    .custom((value) => {
      const regexp = /^(?=[a-zA-Z0-9._]{5,50}$)(?!.*[_.]{2})[^_.].*[^_.]$/g;
      return regexp.test(value);
    })
    .withMessage(
      "Username must be 5-50 characters long and can only contain letters, numbers, underscores and periods. It cannot start or end with a period or underscore or any other data."
    ),
];

exports.getAnakValidator = [
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isLength({ min: 24 })
    .withMessage("The ID is not an ID!"),
];

exports.deleteAnakValidator = [
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isLength({ min: 24 })
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
  param("id")
    .exists()
    .withMessage("User ID is required!")
    .isLength({ min: 24 })
    .withMessage("The ID is not an ID!"),
  body("newPass")
    .exists()
    .withMessage("New Password is required!")
    .isStrongPassword()
    .withMessage("Your password is not strong enough!")
    .isLength({ min: 8 })
    .withMessage("Please input a password of minimum 8 Characters!"),
  body("oldPass").exists().withMessage("Old Password id required!"),
];
