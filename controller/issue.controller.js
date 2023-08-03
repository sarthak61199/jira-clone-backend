const connectToDb = require("../db/index.js");

const createIssue = async (req, res) => {
  const { title, description, assignee, priority } = req.body;
  if (!title || !description || !assignee || !priority) {
    return res.status(404).json({ message: "All fields are required" });
  }
  try {
    const client = await connectToDb();
    await client.query(
      "insert into issues(assignee, title, description, priority) values(?, ?, ?, ?)",
      [assignee, title, description, priority]
    );
    return res.status(201).json({ message: "Issue created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const client = await connectToDb();
    const [issues] = await client.query(
      "select issues.id, issues.assignee, title, description, progress, priority, createdAt, updatedAt, name from issues inner join users on issues.assignee = users.id order by id"
    );
    return res.status(200).json({ issues });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editIssue = async (req, res) => {
  const { id } = req.params;
  const { title, description, assignee, priority, progress } = req.body;
  if (!title || !description || !assignee || !priority || !progress || !id) {
    return res.status(404).json({ message: "All fields are required" });
  }
  try {
    const client = await connectToDb();
    await client.query(
      "update issues set title = (?), description = (?), assignee = (?), progress = (?), priority = (?) where id = (?)",
      [title, description, assignee, progress, priority, id]
    );
    return res.status(201).json({ message: "Issue updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await connectToDb();
    const [issues] = await client.query(
      "select issues.id, issues.assignee, title, description, progress, priority, createdAt, updatedAt, name from issues inner join users on issues.assignee = users.id where issues.id = ? order by id ",
      [id]
    );
    if (issues?.length === 0) {
      return res
        .status(404)
        .json({ message: "No issue found with the given ID" });
    }
    return res.status(200).json({ issues });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStatsById = async (req, res) => {
  try {
    const client = await connectToDb();
    const [issues] = await client.query(
      "select issues.id, issues.assignee, title, description, progress, priority, createdAt, updatedAt, name from issues inner join users on issues.assignee = users.id order by id"
    );
    return res.status(200).json({ issues });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  editIssue,
  getIssueById,
  getStatsById,
};
