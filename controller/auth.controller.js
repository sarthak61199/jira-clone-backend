const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connectToDb = require("../db/index.js");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(404).json({ message: "All fields are required" });
  }
  try {
    const client = await connectToDb();
    const [user] = await client.query(
      "select email from users where email = ?",
      [email]
    );
    if (user.length > 0) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await client.query(
      "insert into users(name, email, password) values(?, ?, ?)",
      [name, email, hashPassword]
    );
    return res.status(201).json({ message: "Successfully registered" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "All fields are required" });
  }
  try {
    const client = await connectToDb();
    const [users] = await client.query("select * from users where email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ message: "Wrong email or password" });
    }
    const user = users[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Wrong email or password" });
    }
    if (!user.isActive) {
      return res
        .status(404)
        .json({ message: "You are account has been deactivated" });
    }
    delete user.password;
    user.roles = user.roles.split(",").map((item) => +item);
    user.isActive = Boolean(user.isActive);
    const accessToken = jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    return res
      .status(200)
      .json({ accessToken, message: "Successfully logged in" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Sucessfully Logged out" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: "You are unauthorized" });
  const refreshToken = cookies.jwt;
  try {
    const client = await connectToDb();
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "You are unauthorized" });
      const [users] = await client.query(
        "select * from users where email = ?",
        [decoded?.user?.email]
      );
      if (users.length === 0) {
        return res.status(401).json({ message: "Wrong email or password" });
      }
      const user = users[0];
      const accessToken = jwt.sign(
        {
          user,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {};

module.exports = { refresh, register, login, logout, changePassword };
