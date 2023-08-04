const express = require("express");

const verifyToken = require("../middleware/verifyToken.js");
const verifyAdminRole = require("../middleware/verifyAdminRole.js");

const {
  getAllUsers,
  deleteUser,
  getStatsById,
} = require("../controller/users.controller.js");

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.delete("/:userId", verifyToken, verifyAdminRole, deleteUser);
router.get("/stats/:id", verifyToken, getStatsById);

module.exports = router;
