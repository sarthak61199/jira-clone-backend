const { ROLES } = require("../config/constants.js");
const connectToDb = require("../db/index.js");

const getAllUsers = async (req, res) => {
  try {
    const client = await connectToDb();
    const [users] = await client.query(
      "select id, name, email, isActive from users"
    );
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ message: "All fields are required" });
  }
  try {
    const client = await connectToDb();
    const [users] = await client.query("select id from users where id = (?)", [
      id,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: "User does't exist" });
    }
    await client.query("update users set isActive = 0 where id = (?)", [id]);
    res.status(200).json({ message: "User deactivated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
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

module.exports = { getAllUsers, deleteUser, getStatsById };
