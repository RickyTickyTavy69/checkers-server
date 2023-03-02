import {body, validationResult} from "express-validator";
import TokensService from "../service/tokens.service.js";
import bcrypt from "bcrypt";
import pool from "../db.js";

class AuthController{
    static async register(req, res){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                console.log("errors not empty", errors);
                //res.status(400).json({errors});
            }
            // if there are no errors
            const userData = req.body.userData;
            console.log("body", req.body.userData);

            //create tokens
            const {accessToken, refreshToken} = await TokensService.createTokens({
                username: userData.username,
                email: userData.email
            })
            //hash password
            const salt = await bcrypt.genSalt();
            const password = userData.password;
            console.log("hash data", salt, password);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await pool.query(`INSERT INTO users (username, email, password, salt, accessToken, refreshToken, checkersColor) values($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [userData.username, userData.email, hashedPassword, salt, accessToken, refreshToken, null]);
            console.log("result trying to insert", newUser.rows[0]);
            res.cookie("refreshToken", refreshToken, {httpOnly: true});
            res.status(200).json({data: {username: newUser.rows[0].username}, msg: "user created", accessToken: accessToken});
        } catch(e){
            console.error("error happened", e);
            res.status(400).json({error: e, msg: "error while creating user"});
        }


    }

    static async getUsers(_, res){
        // this method does not return passwords and Tokens, because it is unsafe to send all this data to front-end
        const response = await pool.query(`SELECT * FROM users`);
        const users = response.rows;
        const usersData = users.map((user) => {
            return {
                id: user.id,
                username: user.username,
                checkersColor: user.checkerscolor,
            }
        })
        res.status(200).json({data: usersData, msg: "got users"});
    };

    static async login(req, res){
        try{
            console.log("body", req.body.userData);
            const errors = validationResult(req.body.userData);
            if(!errors.isEmpty()){
                console.log("errors not empty", errors);
                return res.status(400).json({errors});
            }
            // if there are no errors
            const userData = req.body.userData;
            //console.log("body", req.body.userData);
            const username = userData.username;
            // check if user exists
            const response = await pool.query(`SELECT * FROM users where username = $1`, [username]);
            const user = response.rows[0];
            if(!user){
                return res.status(500).json({msg: "unauthorized"})
            }
            //console.log("user found", user);
            //check password
            const password = userData.password;
            const isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual){
                return res.status(500).json({msg: "wrong authorization data"});
            }
            //create tokens
            const {accessToken, refreshToken} = await TokensService.createTokens({
                username: userData.username,
                email: user.email // because a user does not log in with email, but payload should be the same
            })
            //console.log("updating the user...");
            await pool.query(`UPDATE "users" SET "accesstoken" = $1, "refreshtoken" = $2 WHERE "username" = $3`, [accessToken, refreshToken, username]);

            res.cookie("refreshToken", refreshToken, {httpOnly: true, maxAge: 60 * 60 * 60 * 24 * 15});
            res.status(200).json({data: {username}, msg: "user logged in", accessToken: accessToken});
        } catch(e){
            //console.error("error happened", e);
            res.status(400).json({error: e, msg: "error while creating user"})
        }
    }

    static async getOneUser(req, res,){
        const id = req.params.id;
        const user = await pool.query(`SELECT * FROM users where id = $1`, [id]);
        res.status(200).json({data: user.rows[0], msg: "got user"});
    }

    static async updateUser(req, res){
        const password = req.body.password;
        const user = await pool.query(`UPDATE users set password = $1`, [password]);
        res.status(200).json({data: user.rows[0], msg: "user has been updated"})
    }

    static async deleteUser(req, res){
        const id = req.params.id;
        const user = await pool.query(`DELETE * FROM users where id = $1`, [id]);
        res.status(200).json({data: user.rows[0], msg: "got user"});
    }
}

export default AuthController;