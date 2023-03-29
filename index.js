require("dotenv").config();
const mainRoute = "/api/v1";
const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/configs/db-config");
const { errorHandler } = require("./src/middlewares/error-handler");
const session = require("express-session");

dbConnect();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  mainRoute,
  cors({
    origin: "https://marica.vercel.app",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(`${mainRoute}/user`, require("./src/routes/user"));
app.use(`${mainRoute}/series`, require("./src/routes/series"));
app.use(`${mainRoute}/video`, require("./src/routes/video"));

// Email validation route
app.use(`/user`, require("./src/routes/user-validation"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started! http://localhost:${port}`));
