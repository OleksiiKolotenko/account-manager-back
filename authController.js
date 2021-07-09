const Role = require("./models/Role");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (email, username, roles) => {
  const payload = {
    email,
    username,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async me(req, res) {
    try {
      const token = req.get("token");
      const user = jwt.decode(token);
      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }
      const { username, password, email, isAdmin } = req.body;
      console.log("Userdata: ", { username, password, email, isAdmin });
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with such name already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 6);

      let userRole;
      if (!isAdmin) {
        userRole = await Role.findOne({ value: "USER" });
      } else {
        userRole = await Role.findOne({ value: "ADMIN" });
      }

      const user = new User({
        username,
        email,
        password: hashPassword,
        roles: userRole.value,
      });

      await user.save();
      return res.json({
        message: "User was registered",
        user: {
          username,
          email,
          roles: userRole.value,
        },
      });
    } catch (event) {
      console.log(event);
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(200)
          .json({ message: `Email ${email} was not found in the base` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(200).json({ message: `Wrong password` });
      }
      const token = generateAccessToken(user.email, user.username, user.roles);
      return res.json({ token });
    } catch (event) {
      console.log(event);
      res.status(400).json({ message: "Login error" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (event) {
      console.log(event);
    }
  }
}

module.exports = new authController();
