import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import GitHubIcon from '@material-ui/icons/GitHub'
import SettingsIcon from '@material-ui/icons/Settings'
import TuneIcon from '@material-ui/icons/Tune'
import { Card, Typography as Typo } from 'antd'

import background from './assets/img/landing.jpg'
import imgG from './assets/img/generator.png'
import imgD from './assets/img/detector.png'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  appbar: {
    backgroundColor: 'rgba(0,0,0,0)',
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0))'
  },
  toolbar: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  toolButtonGroup: {
    marginLeft: theme.spacing(2),
  },
  white: {
    color: 'white'
  },
  board: {
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  boardItem: {
    width: '50vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: 320,
    height: 390,
    padding: theme.spacing(4),
    border: 'none',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    "&:hover": {
      backgroundColor: 'rgba(0,0,0,0.5)',
      transition: 'background-color 0.5s ease'
    }
  },
  meta: {
    textAlign: 'center'
  },
  img: {
    filter: 'invert()'
  }
}))

export default function Landing(){
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar className={classes.appbar} position="fixed">
        <Toolbar className={classes.toolbar}>
          <Link to="/">
            <Typography className={classes.white} variant="h6" noWrap>VisionLab</Typography>
          </Link>
          <div className={classes.toolButtonGroup}>
            <Link to="/trainings">
              <Tooltip title="Model Trainings">
                <IconButton>
                  <TuneIcon className={classes.white}/>
                </IconButton>
              </Tooltip>
            </Link>
            <Link to="/settings">
              <Tooltip title="System Settings">
                <IconButton>
                  <SettingsIcon className={classes.white}/>
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Project Site">
              <IconButton href="https://github.com/IRS-3Y/Vision-Lab" target="_blank">
                <GitHubIcon className={classes.white}/>
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.board}>
        <div className={classes.boardItem}>
          <Card className={classes.card}
            hoverable
            cover={<img className={classes.img} alt="generator" src={imgG}/>}
            onClick={()=>history.push('/generator')}
          ><Card.Meta className={classes.meta} 
            title={<Typo.Title level={3} style={{color: 'white'}}>Image Generator</Typo.Title>}/>
          </Card>
        </div>
        <div className={classes.boardItem}>
          <Card className={classes.card}
            hoverable
            cover={<img className={classes.img} alt="detector" src={imgD}/>}
            onClick={()=>history.push('/detector')}
          ><Card.Meta className={classes.meta} 
            title={<Typo.Title level={3} style={{color: 'white'}}>Image Detector</Typo.Title>}/>
          </Card>
        </div>
      </div>
    </div>
  )
}