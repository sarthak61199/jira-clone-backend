require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions.js");
const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");
const issueRoute = require("./routes/issue.route.js");

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/issue", issueRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
