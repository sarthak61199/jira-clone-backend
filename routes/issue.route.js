const express = require("express");
const verifyToken = require("../middleware/verifyToken.js");

const {
  createIssue,
  getAllIssues,
  editIssue,
  getIssueById,
  getProgressList,
  getPriorityList,
} = require("../controller/issue.controller.js");

const router = express.Router();

router.get("/", verifyToken, getAllIssues);
router.get("/progress", verifyToken, getProgressList);
router.get("/priority", verifyToken, getPriorityList);
router.get("/:id", verifyToken, getIssueById);
router.post("/", verifyToken, createIssue);
router.put("/:id", verifyToken, editIssue);

module.exports = router;
