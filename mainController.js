const Role = require("./models/Role");
const User = require("./models/User");
const Profile = require("./models/Profiles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (email, username, roles, _id) => {
  const payload = {
    email,
    username,
    roles,
    id: _id,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class mainController {
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

      await user.save((err, user) => {
        const id = user._id;
        return res.json({
          message: "User was registered",
          user: {
            username,
            email,
            roles: userRole.value,
            id: user._id,
          },
        });
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
        return res.status(200).json({ message: `Wrong password or email` });
      }
      const token = generateAccessToken(
        user.email,
        user.username,
        user.roles,
        user._id
      );
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

  async getChosenUser(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const user = await User.findById(userId);
      res.json(user);
    } catch (event) {
      console.log(event);
    }
  }
  async profileLoad(req, res) {
    try {
      const token = req.get("token");
      const user = jwt.decode(token);
      const { name, gender, birthdate, city, user_id } = req.body;
      const profile = new Profile({
        name,
        gender,
        birthdate,
        city,
        user_id: user.id,
      });
      await profile.save();
      return res.json(profile);
    } catch (event) {
      console.log(event);
    }
  }
  async profileAdminLoad(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const { name, gender, birthdate, city, user_id } = req.body;
      const profile = new Profile({
        name,
        gender,
        birthdate,
        city,
        user_id: userId,
      });
      await profile.save();
      return res.json(profile);
    } catch (event) {
      console.log(event);
    }
  }
  async getProfiles(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const profiles = await Profile.find({ user_id: userId });
      res.json(profiles);
    } catch (event) {
      console.log(event);
    }
  }

  async getOtherProfiles(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const profiles = await Profile.find({ user_id: userId });
      res.json(profiles);
    } catch (event) {
      console.log(event);
    }
  }

  async getAllProfiles(req, res) {
    try {
      const profiles = await Profile.find();
      res.json(profiles);
    } catch (event) {
      console.log(event);
    }
  }

  async getAdult(req, res) {
    try {
      const profiles = await Profile.find();
      function days(year, month, day) {
        return year * 365 + month * 30 + day;
      }
      const adult = days(18, 0, 0);
      const adults = profiles.filter((profile) => {
        const date = new Date(profile.birthdate);
        const now = new Date();
        if (
          days(now.getFullYear(), now.getMonth(), now.getDate()) -
            days(date.getFullYear(), date.getMonth(), date.getDate()) >=
          adult
        ) {
          return profile;
        }
        return false;
      });
      res.json(adults);
    } catch (event) {
      console.log(event);
    }
  }
  async editProfile(req, res) {
    try {
      const profileId = req.params.id;
      const updatedProfile = await Profile.updateOne(
        { _id: profileId },
        {
          $set: {
            name: req.body.name,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            city: req.body.city,
          },
        }
      );
      res.json(updatedProfile);
    } catch (event) {
      console.log(event);
    }
  }

  async editUser(req, res) {
    try {
      const userId = req.params.id || req.userId;
      const updatedUser = await User.updateOne(
        { _id: userId },
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            roles: req.body.roles,
          },
        }
      );
      res.json(updatedUser);
    } catch (event) {
      console.log(event);
    }
  }

  async deleteProfile(req, res) {
    try {
      const profileId = req.params.id;
      await Profile.findByIdAndDelete(profileId, (error) => {
        if (error) {
          res.status(404).send("Error");
        } else {
          res.status(204).send("Success");
        }
      });
    } catch (event) {
      console.log(event);
    }
  }
}

module.exports = new mainController();
