const express = require("express");
const User = require("../models/User");
const TokenBD = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const key = require("../config");
const {secretRefreshKey} = require("../config");

let refreshTokens = [];
const  generateAccessToken = (id, username) => {
    const payload = {
        id,
        username
    }
    return jwt.sign(payload, key.secretAccessKey, {expiresIn: "30m"});
}
const  generateRefreshToken = (id, username) => {
    const payload = {
        id,
        username
    }

    return jwt.sign(payload, key.secretRefreshKey, {expiresIn: "120m"});
}

class AuthController {


    async registration (request, response){
        try {
            const {username, password} = request.body;

            const candidate = await User.findOne({username});
            if (candidate){
                 return response.status(400).json({message: "User exist"});
            }

            const hashPassword = bcrypt.hashSync(password, 10);
            const user = new User ({username: username, password: hashPassword});
            await user.save();
            response.json({message: "User registered"});
        }catch (err){
            console.log(err);
            response.status(404).json({message: "registration error"})
        }
    }

    //when user log in send two tokens
    async login (request, response){
        try {
            const {username, password} = request.body;
            const user = await User.findOne({username});

            if (!user){
                return response.status(400).json({message: `user ${username} not exist`});
            }

            const validPassword = await bcrypt.compareSync(password, user.password);
            if (!validPassword){
                return response.status(400).json({message: "password wrong"});
            }
            const accessToken = generateAccessToken(user._id, user.username);
            const refreshToken = generateRefreshToken(user._id, user.username);
            const token = new TokenBD({token: refreshToken});
           await token.save();

           return response.json({accessToken,refreshToken});

        }catch (err){
            response.status(400).json({message: "login error"});
        }
    }


    //get refresh token in the body of the request, searching in the base and access token send
    async token (request, response){
        try {
            const refreshToken = request.body.token;
            if (refreshToken==null) return response.status(401).json({message: "no token in body"});

            const token = await TokenBD.findOne({refreshToken});
            if (!token) return response.status(403).json({message: "this token is not"});

             jwt.verify(refreshToken, secretRefreshKey, (err, user)=>{
                if (err) return response.status(403).json({message: " "});
                const newAccessToken =  generateAccessToken(user.id, user.username);
                return response.json({accessToken: newAccessToken});
            });

        }catch (err){
            response.status(400).json({message: "error refresh"});
        }
    }

    //searching refresh token in the base, if he is not - user log out, if he is — delete it
    async logout (request, response) {
        try {
            const refreshToken = request.body.token;
            if (!refreshToken) return response.status(400).json({message: "Not found token in body"});
            const userToken = await TokenBD.findOne({refreshToken});
            if (!userToken) return response.status(200).json({message: "Logged Out Sucessfully"});
            await userToken.remove();
            response.status(200).json({message: "Logged Out Sucessfully"});
        } catch (err) {
            response.status(400).json({message: "error logout"});
        }
    }
}
module.exports = new AuthController();


