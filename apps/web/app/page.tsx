/* page.js */
'use client'
import React, { useState } from 'react'
import styles from './page.module.css' 
import { useSocket } from '../context/SocketProvider';

const Page = () => {
  const {sendMessage,messages} = useSocket();

  const [message , setMessage] =useState('');

  return (
    <div>
     <div>
      {messages.map(e=><li>{e}</li>)}
     </div>
      <div>
        <input onChange={e=>setMessage(e.target.value)} type="text" className={styles['chat-input']} placeholder='Message..'/>
        <button onClick={e=>sendMessage(message)} className={styles['button']}>Send</button>
      </div>
    </div>
  )
}

export default Page;
