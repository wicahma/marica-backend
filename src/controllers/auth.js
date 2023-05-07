const asyncHandler = require("express-async-handler");
const { user } = require("../models/user");
const { generateToken, generateValidation } = require("../middlewares/auth");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

exports.loginGoogle = asyncHandler(async (req, res, next) => {});
