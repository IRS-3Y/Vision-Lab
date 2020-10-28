import React from 'react'

import '../../assets/css/chatbot.scss'
import image from '../../assets/img/chatbot.png'

export default function ChatBot({content = [], actions = [], actionsTitle}) {
  let bubble = null;
  if(content.length){
    bubble = (
      <div className="chatbot-bubble">
        {content.map((c, i) => (<p key={i}>{c}</p>))}
        {actions.length? (
          <div className="chatbot-actions">
            {actionsTitle? <div className="chatbot-actions-title">{actionsTitle}</div>: null}
            {actions}
          </div>
        ): null}
        <div className="chatbot-bubble-arrow"></div>
      </div>
    )
  }
  return (
    <div className="chatbot-container">
      {bubble}
      <img alt="chatbot" src={image}/>
    </div>
  )
}