import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { tokenController, redisController } from './controllers/auth.controller.js';
import { mqttInit } from './middlewares/mqtt.middleware.js';
import { publishController, subscribeController } from './controllers/mqtt.controller.js';
import { verifyToken } from './middlewares/auth.middleware.js'
import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use(mqttInit)

connectDB()
    .then(() => {
        app.post('/', tokenController);
        app.get('/', verifyToken, redisController);
        app.post('/publish', publishController);
        app.get('/subscribe', subscribeController);
        app.listen(PORT, () => {
            console.log(`Server is running at PORT ${PORT}`)
        });
    })
    .catch(() => {
        console.log("Server Error")
    })
