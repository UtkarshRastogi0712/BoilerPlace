function databaseFile() {
  return `
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const MONGO_NAME = process.env.MONGO_NAME;

mongoose
  .connect(MONGO_URI, {
    dbName: MONGO_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
`;
}

export default databaseFile;
