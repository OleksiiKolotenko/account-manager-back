const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const roleMiddleWare = require("./middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "Name can not be empty").notEmpty(),
    check("username", "Username should be from 6 to 16 symbols").isLength({
      min: 6,
      max: 16,
    }),
    check("password", "Password should be from 6 to 18 symbols").isLength({
      min: 6,
      max: 18,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleWare(), controller.getUsers);

module.exports = router;
