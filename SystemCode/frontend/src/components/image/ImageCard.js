import React from 'react'
import { Card } from 'antd'
import { 
  HeartOutlined, HeartTwoTone,
  CloudDownloadOutlined as DownloadOutlined 
} from '@ant-design/icons'

import Image from './Image'

export default function ImageCard({
  className, url,
  onDownload, onLike, onDislike
}){
  const [liked, setLiked] = React.useState(false);
  const toggleLiked = () => {
    setLiked(!liked);
    if(liked){
      onDislike && onDislike();
    }else{
      onLike && onLike();
    }
  }

  const handleDownload = () => {
    downloadImage(url);
    onDownload && onDownload();
  }

  const actions = [];
  if(liked){
    actions.push(
      <HeartTwoTone key="heart" onClick={toggleLiked} twoToneColor="#ff3629"/>
    );
  }else{
    actions.push(
      <HeartOutlined key="heart" onClick={toggleLiked}/>
    );
  }
  actions.push(<DownloadOutlined key="download" onClick={handleDownload}/>);

  return (
    <Card className={className}
      bodyStyle={{ padding: 0 }}
      hoverable
      cover={<Image url={url}/>}
      actions={actions}
    />
  )
}

function downloadImage(url){
  let link = document.createElement('a');
  link.href = url;
  link.download = url.substring(url.lastIndexOf('/')+1);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}