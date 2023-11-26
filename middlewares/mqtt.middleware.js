import * as mqtt from 'mqtt';
const mqttClient = mqtt.connect(process.env.MQTT_CLIENT_URI);

mqttClient.on('connect', function () {
    console.log('Connected to MQTT broker')
});

export function mqttInit (req, res, next) {
    // Publish messages
    req.mqttPublish = function (topic, message) {
        mqttClient.publish(topic, message)
    }
    // Subscribe to topic
    req.mqttSubscribe = function (topic, callback) {
        mqttClient.subscribe(topic)
        mqttClient.on('message', function (t, m) {
            if (t === topic) {
                callback(m.toString())
            }
        })
    }
    next();
}