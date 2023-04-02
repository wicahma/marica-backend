require("dotenv").config();
const mainRoute = "/api/v1";
const express = require("express");
const cors = require("cors");
const dbConnect = require("./configs/db-config");
const { errorHandler } = require("./middlewares/error-handler");
const session = require("express-session");

dbConnect();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 604800 },
  })
);

app.use(`${mainRoute}/user`, require("./routes/user"));
app.use(`${mainRoute}/series`, require("./routes/series"));
app.use(`${mainRoute}/video`, require("./routes/video"));

// Email validation route
app.use(`/user`, require("./routes/user-validation"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started! http://localhost:${port}`));
