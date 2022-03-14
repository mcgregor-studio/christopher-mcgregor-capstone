const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 3100;
const imageRoutes = require("./routes/images");

//Server test to see what methods are being called at which endpoints
app.use((req, _, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

//Node libraries to ensure pages load properly
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use("/", imageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
