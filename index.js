require("dotenv").config();
const mainRoute = "/api/v1";
const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/configs/db-config");
const { errorHandler } = require("./src/middlewares/error-handler");
const session = require("express-session");
const googlePassport = require("./src/configs/passports/google");
const passport = require("passport");
const facebookPassport = require("./src/configs/passports/facebook");
const instagramPassport = require("./src/configs/passports/instagram");

dbConnect();
googlePassport();
facebookPassport();
instagramPassport();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 1 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", (req, res, next) => {
  console.log(req.session);
  next();
});
app.use(`${mainRoute}/user`, require("./src/routes/user"));
app.use(`${mainRoute}/series`, require("./src/routes/series"));
app.use(`${mainRoute}/video`, require("./src/routes/video"));
app.use(`${mainRoute}/payment`, require("./src/routes/payment"));
app.use(`${mainRoute}/auth`, require("./src/routes/auth"));

// Email validation route./src/routes/user-validation
app.use(`/user`, require("./src/routes/user-validation"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started! http://localhost:${port}`));
