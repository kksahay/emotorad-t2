import { User } from "../model/user.model.js";
import JWT from 'jsonwebtoken';
import { redisClient } from "../server.js";

export const tokenController = async (req, res) => {
    try {
        const { email } = req.body;
        //validate email via regex
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            throw new Error("Invalid email");
        }

        let token;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            token = JWT.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
        } else {
            const user = await User.create({
                email
            });
            const createdUser = await User.findById(user.id).lean();
            if(!createdUser) {
                throw new Error("Database Error");
            }
            token = JWT.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
        }
        return res.status(200).send({token});

    } catch (error) {
        return res.status(400).send(error.message);
    }
}

export const redisController = async (req, res) => {
    try {
        const value = await redisClient.get('speed');
        if(!value) {
            throw new Error("No value exists");
        }
        return res.status(200).send(value);
    } catch (error) {
        return res.status(400).send(error.message);
    }
}