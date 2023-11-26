import JWT from 'jsonwebtoken';

export async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new Error("Unauthorized - Missing token");
        }
        const decode = JWT.verify(
            token,
            process.env.JWT_SECRET
        )
        if(!decode) {
            throw new Error("Unauthorized - Invalid token");
        }
        req.user = decode;
        next();
    } catch (error) {
        return res.status(400).send(error);
    }
}