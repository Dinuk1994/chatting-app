'use client'
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io ,Socket} from 'socket.io-client'


interface SocketProvider {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string) => any
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
    const state = useContext(SocketContext)
    if (!state) throw new Error('State is undefined')
    return state;
}

export const SocketProvider: React.FC<SocketProvider> = ({ children }) => {

    const [socket,setSocket] =useState<Socket>()

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log("Send Message", msg);
        if(socket){
            socket.emit('event:message', {message : msg})
        }
    }, [socket])

    const onMessageRec = useCallback((msg:string)=>{
        console.log('From server msg received',msg);
        
    },[])

    useEffect(() => {
        const _socket = io('http://localhost:8000')
        _socket.on('message',onMessageRec)
        setSocket(_socket)

        return () => {
            _socket.off('message',onMessageRec)
            _socket.disconnect();
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    )
}