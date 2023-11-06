const express = require("express");
const createError = require("http-errors");
require("dotenv").config();
const Router = require("./Routes/router.js");
require("./Helpers/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/routers", Router);

app.get("/", async (req, res, next) => {
  res.send("It works!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
