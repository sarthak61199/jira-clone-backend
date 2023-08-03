const express = require("express");
const verifyToken = require("../middleware/verifyToken.js");
const {
  createIssue,
  getAllIssues,
  editIssue,
  getIssueById,
  getStatsById,
} = require("../controller/issue.controller.js");

const router = express.Router();

router.get("/", verifyToken, getAllIssues);
router.get("/stats/:id", verifyToken, getStatsById);
router.get("/:id", verifyToken, getIssueById);
router.post("/", verifyToken, createIssue);
router.put("/:id", verifyToken, editIssue);
router.delete("/");

module.exports = router;
