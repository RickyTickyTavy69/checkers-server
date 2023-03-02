import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try{
        //console.log("header", req.headers);
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];
        const result = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET, {});
        //console.log("token", accessToken);
        //console.log("result", result);
        const cookie = req.cookie;
        next();
    } catch(e){
        //console.log("cookie", req.cookies);
        //console.log("error", e);

    }

}

export default authMiddleware;