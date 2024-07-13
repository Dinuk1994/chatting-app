require('dotenv').config();
import { Server, Socket } from "socket.io";
import { Redis } from "ioredis";
import prismaClient from "./prisma";
import { text } from "stream/consumers";
import {produceMessage} from './kafka'
 
const pub = new Redis({
    host: process.env.HOST,
    port: 15416,
    username:process.env.USERNAME,
    password: process.env.PASSWORD
});

const sub = new Redis({
    host: process.env.HOST,
    port: 15416,
    username:process.env.USERNAME,
    password: process.env.PASSWORD
});

class SocketService {
    private _io :Server
    constructor(){
        console.log("init Socket Service...");   
        this._io = new Server({
            cors:{
                allowedHeaders:['*'],
                origin : "*"
            }
        });
        sub.subscribe('MESSAGES')
    }

    public initListeners(){
        const io = this.io;
        console.log('Init Socket Listeners...');
        
        io.on('connect',(socket) =>{
            console.log('New Socket Connected',socket.id);

            socket.on('event:message',async({message}:{message:string})=>{
                console.log('New message recieved', message);

                //publishing message to redis

                await pub.publish('MESSAGES',JSON.stringify({message}))

            })           
        })   
        sub.on ('message', async(channel,message)=>{
            if(channel==='MESSAGES'){
                io.emit('message',message)
                await produceMessage(message)
                console.log("message produce to Kafka broker");
                
            }
        }) 
    }

    get io(){
        return this._io
    }
}

export default SocketService; 