import { redisClient } from "../server.js";

export const publishController = (req, res) => {
    try {
        const { speed } = req.body;
        req.mqttPublish(process.env.MQTT_TOPIC, speed.toString());
        return res.status(200).send({
            message:'MQTT data published',
            speed
        });
    } catch (error) {
        return res.status(400).send("Error publishing data");
    }
}

export const subscribeController = (req, res) => {
    req.mqttSubscribe(process.env.MQTT_TOPIC, async (message) => {
        console.log('Received message: ' + message)
        //send message to redis db
        await redisClient.set('speed', message);
    });
    res.send('MQTT data subscribed')
}
