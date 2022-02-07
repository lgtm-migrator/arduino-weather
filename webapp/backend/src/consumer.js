const mqtt = require('mqtt');
const Data = require('./api/models/data.model');
const mongoose = require('./config/mongoose');

const options = {
    host: '6350ae3f4b4b4399993427d858f6e29d.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'arkadip',
    password: process.env.MQTT_PASSWORD,
}

//initialize the MQTT client
const client = mqtt.connect(options);

mongoose.connect();

//setup the callbacks
client.on('connect', () => {
    console.log('MQTT Connected');
});

client.on('error', (error) => {
    console.log(error);
});

client.on('message', async (topic, message) => {
    //Called each time a message is received
    if (topic === 'data') {
        const data = message.toString();
        const data_json = JSON.parse(data)
        const res = await new Data(data_json).save();
        console.log(res)
    }
});

// subscribe to topic 'my/test/topic'
client.subscribe('data');
