const Router = require("express");
const router = new Router();
const controller = require("./mainController");
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
    check("password", "Password can not be empty").notEmpty(),
    check("password", "Password should be from 6 to 18 symbols").isLength({
      min: 6,
      max: 18,
    }),
  ],
  controller.registration
);
router.post(
  "/login",
  [
    check("email", "Email can not be empty").notEmpty(),
    check("email", "Email can not be empty").isEmail(),
    check("password", "Password can not be empty").notEmpty(),
    check("password", "Password should be from 6 to 18 symbols").isLength({
      min: 6,
      max: 18,
    }),
  ],
  controller.login
);
router.get("/me", controller.me);
router.post("/profileLoad", controller.profileLoad);
router.get("/getProfiles/:id", controller.getProfiles);
router.get("/getOtherProfiles/:id", controller.getOtherProfiles);
router.get("/getAllProfiles/", controller.getAllProfiles);
router.get("/adult", controller.getAdult);
router.patch("/editProfile/:id", controller.editProfile);
router.delete("/deleteProfile/:id", controller.deleteProfile);
router.get("/getUsers", controller.getUsers);

module.exports = router;
