const jwt = require("jsonwebtoken");
const { secret } = require("../config");
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User didn't log in" });
    }
    const decodedData = jwt.verify(token, secret);
    req.user = decodedData;
    next();
  } catch (event) {
    console.log(event);
    return res.status(403).json({ message: "User didn't log in" });
  }
};
