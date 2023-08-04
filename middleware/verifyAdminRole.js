const { ROLES } = require("../config/constants.js");

const verifyAdminRole = (req, res, next) => {
  const { user } = req;
  if (!user.roles.includes(ROLES.ADMIN)) {
    return res
      .status(403)
      .json({ message: "You don't have the permission for this action" });
  }
  next();
};

module.exports = verifyAdminRole;
