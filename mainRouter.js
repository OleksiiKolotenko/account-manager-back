const Router = require("express");
const router = new Router();
const controller = require("./mainController");
const { check } = require("express-validator");

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
router.post("/profileAdminLoad/:id", controller.profileAdminLoad);
router.get("/getProfiles/:id", controller.getProfiles);
router.get("/getOtherProfiles/:id", controller.getOtherProfiles);
router.get("/getAllProfiles/", controller.getAllProfiles);
router.delete("/deleteAllProfiles/:id", controller.deleteAllProfiles);
router.get("/adult", controller.getAdult);
router.patch("/editProfile/:id", controller.editProfile);
router.patch("/editUser/:id", controller.editUser);
router.delete("/deleteProfile/:id", controller.deleteProfile);
router.delete("/deleteUser/:id", controller.deleteUser);
router.get("/getUsers", controller.getUsers);
router.get("/getChosenUser/:id", controller.getChosenUser);

module.exports = router;
