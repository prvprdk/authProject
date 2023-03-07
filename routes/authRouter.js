const express = require("express");
const authRouter = express.Router();

const controller = require("../controllers/authController")


authRouter.post ("/login",controller.login);
authRouter.post ("/registration", controller.registration);
authRouter.delete("/logout", controller.logout)
authRouter.post ("/token", controller.token );

module.exports = authRouter;