import React from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { Affix, PageHeader } from 'antd'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#eeeeee",
    border: "1px solid rgb(235, 237, 240)"
  }
}))

export default function AffixHeader({title}){
  const classes = useStyles();
  const history = useHistory();
  return (
    <Affix offsetTop={80}>
      <div className={classes.root}>
        <PageHeader title={title} ghost={false} onBack={() => history.push("/")}/>
      </div>
    </Affix>
  )
}