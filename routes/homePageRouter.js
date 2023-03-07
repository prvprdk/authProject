const express = require ("express");
const homeRouter = express.Router();
const authMiddleware = require ("../middleware/authMiddleware");
const User = require("../models/User");

homeRouter.use("/page", authMiddleware, function (request, response){
    const user = response.user.id;
    response.json({name : user});
})

module.exports = homeRouter;