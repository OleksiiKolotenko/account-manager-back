const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "User didn't log in" });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      if (userRoles === "USER") {
        return res.status(403).json({ message: "You don't have permission" });
      }

      next();
    } catch (event) {
      console.log(event);
      return res.status(403).json({ message: "User didn't log in" });
    }
  };
};
