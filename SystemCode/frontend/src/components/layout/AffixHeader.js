import React from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { Affix, PageHeader } from 'antd'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "rgb(247, 247, 247, 0.7)",
    border: "1px solid rgb(235, 237, 240)"
  }
}))

export default function AffixHeader({title, extra = [], children}){
  const classes = useStyles();
  const history = useHistory();
  return (
    <Affix offsetTop={80}>
      <div className={classes.root}>
        <PageHeader title={title} extra={extra} onBack={() => history.push("/")}>
          {children}
        </PageHeader>
      </div>
    </Affix>
  )
}