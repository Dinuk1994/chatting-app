require('dotenv').config();
import { Kafka, Producer } from 'kafkajs';
import fs from 'fs';
import path from 'path';



const kafka = new Kafka({
    brokers: ['kafka-4ea2939-ddt94119-4e98.i.aivencloud.com:15429'],
    ssl: {
        ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],
    },
    sasl: {
        username: 'avnadmin',
        password: 'AVNS_TKoQ3S6p7mxuycX1cQ_',
        mechanism: 'plain',
    }
});


let producer: null | Producer = null

export async function createProducer() {
    if (producer) return producer;
    const _producer = kafka.producer()
    await _producer.connect()
    producer = _producer
    return producer;
}

export async function produceMessage(message: string) {
    const producer = await createProducer();
    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: 'MESSAGES'
    })
    return true
}



export default kafka
