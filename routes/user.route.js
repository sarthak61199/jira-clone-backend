const express = require("express");

const verifyToken = require("../middleware/verifyToken.js");
const {
  getAllUsers,
  deleteUser,
} = require("../controller/users.controller.js");

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.delete("/:userId", deleteUser);

module.exports = router;
