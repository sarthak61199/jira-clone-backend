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
  const user = req.user.user;
  if (!user.roles.includes(ROLES.ADMIN) || !user.isActive) {
    return res.status(403).json({ message: "You are not an admin" });
  }
  const { userId } = req.params;
  try {
    const resp = await client.query(
      "select assignee, name, email, isActive from jira.users"
    );
    const users = resp.rows;
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getAllUsers, deleteUser };
