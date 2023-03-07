const {Schema, model} = require("mongoose");

const Token = new Schema({
    token: {type: String, unique: true},
    expireAt: {type: Date, expires: "120m",  default: Date.now() }
})

module.exports = model("Token", Token);