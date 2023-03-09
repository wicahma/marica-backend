require("dotenv").config();
const mainRoute = "/api/v1";
const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/configs/db_config");
const { errorHandler } = require("./src/middlewares/error_handler");

dbConnect();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(`${mainRoute}/user`, require("./src/routes/user"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started! http://localhost:${port}`));
