const express = require("express");
const verifyToken = require("../middleware/verifyToken.js");

const router = express.Router();

const {
  register,
  login,
  logout,
  refresh,
  changePassword,
} = require("../controller/auth.controller.js");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.put("/changePassword", verifyToken, changePassword);

module.exports = router;
