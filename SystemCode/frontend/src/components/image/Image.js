import React from 'react';
import { makeStyles } from '@material-ui/core';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0
  },
  image: {
    maxWidth: "80vw"
  }
}))

export default function Image({file, imgProps = {}}){
  const classes = useStyles();
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    let active = true;
    if(file){
      getBase64(file).then(data => {
        if (active) {
          setImage(data);
        }
      });
    }else{
      setImage(null);
    }
    return () => { active = false; };
  }, [file]);
  
  return (
    <div className={classes.root}>
      {image? <img className={classes.image} src={image} alt="" {...imgProps}/>: null}
    </div>
  )
}