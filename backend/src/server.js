require("dotenv").config();  // 🔥 MUST BE FIRST

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected 🔥");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed ❌", err);
  });