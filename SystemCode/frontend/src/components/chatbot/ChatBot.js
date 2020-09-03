import React from 'react'

import '../../assets/css/chatbot.scss'
import image from '../../assets/img/chatbot.png'

export default function ChatBot() {
  return (
    <div className="chatbot-container">
      <img alt="chatbot" src={image}/>
    </div>
  )
}