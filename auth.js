import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const JWT_SCRECT_KEY = process.env.JWT_SCRECT_KEY;

const auth = (req, res, next) => {
    try {
        const tokenHead = req.headers.authorization;
        if (tokenHead) {
            const token = tokenHead.split(" ")[1];
            // console.log(token)
            const user = jwt.verify(token, JWT_SCRECT_KEY);
            req.userId = user.id;
            const userId = user.id;
            return ({ message: "Token Authorized", userId: userId })
        } else {
            return ({ message: "Unauthorized user token" });
        }
        next()
    } catch (error) {
        console.log(error);
        res.send({ message: "Unauthorized user", error: error.message });
    }
}

export default auth;
