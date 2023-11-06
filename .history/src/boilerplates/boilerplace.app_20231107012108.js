function appFile() {
  return `
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  res.send("It works!");
});

app.listen(PORT, () => {
  console.log("Server is running");
});`;
}

export default appFile;
