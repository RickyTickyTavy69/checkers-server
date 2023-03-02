import jwt from "jsonwebtoken"

class TokensService{

    static async createTokens(payload){

        const accessToken = jwt.sign(payload, process.env.ACESS_TOKEN_SECRET, {expiresIn: 60 * 30}); // 30min
        const refreshToken = jwt.sign(payload, process.env.ACESS_TOKEN_SECRET, {expiresIn: 60 * 60 * 24 * 15}); // a week
        return {accessToken, refreshToken}
    }
}

export default TokensService;