const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const roleMiddleWare = require("./middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "Name can not be empty").notEmpty(),
    check("username", "Password should be from 4 to 10 symbols").isLength({
      min: 4,
      max: 10,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleWare(), controller.getUsers);

module.exports = router;
