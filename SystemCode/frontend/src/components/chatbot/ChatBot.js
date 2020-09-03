import React from 'react'

import '../../assets/css/chatbot.scss'
import image from '../../assets/img/chatbot.png'

export default function ChatBot({getContent}) {
  const [content, setContent] = React.useState([]);

  React.useEffect(() => {
    let handle = window.setInterval(() => {
      let content = getContent();
      setContent([...content]);
    }, 500);
    return () => { window.clearInterval(handle) };
  }, [getContent]);

  let bubble = null;
  if(content.length){
    bubble = (
      <div className="chatbot-bubble">
        {content.map((c, i) => (<p key={i}>{c}</p>))}
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