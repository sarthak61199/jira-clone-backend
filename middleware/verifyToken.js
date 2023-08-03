const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "You are unauthorized" });
  }
  const authorizationHeader = authorization.split(" ");
  if (
    authorizationHeader.length !== 2 ||
    authorizationHeader[0] !== "Bearer" ||
    !authorizationHeader[1]
  ) {
    return res.status(401).json({ message: "You are unauthorized" });
  }
  const accessToken = authorizationHeader[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, function (err, decoded) {
    if (err || !decoded?.user?.isActive) {
      return res.status(401).json({ message: "You are unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
