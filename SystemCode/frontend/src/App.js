import React from 'react';
import clsx from 'clsx';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { makeStyles, useTheme, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import GitHubIcon from '@material-ui/icons/GitHub';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MessageSnackbar from './components/core/MessageSnackbar';
import ChatBot from './components/chatbot/ChatBot';
import AppService, {messageQueue, getChatContent, setChatContent} from './services/AppService';
import FakeImageDetector from './views/FakeImageDetector';

const app = new AppService();
//check app status
//app.checkStatus();
//load app settings from backend
//app.loadSettings();

const drawerWidth = 240;

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#b8d6ff"
    },
    type: "dark"
  }
});
const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b67cc"
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  toolButtonGroup: {
    marginLeft: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#185eba",
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  white: {
    color: 'white'
  },
  graphSettings: {
    color: 'white',
    padding: theme.spacing(2,1)
  }
}));

export default function App() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logo = (
    <Link to="/"><Typography className={classes.white} variant="h6" noWrap>VisionLab</Typography></Link>
  )
  const toolbarMenu = (
    <ButtonGroup variant="text">
      <Button href="/" target="_blank">
        <Typography className={classes.white} variant="subtitle1" noWrap>About</Typography>
      </Button>
    </ButtonGroup>
  )
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar className={clsx(classes.appBar, {[classes.appBarShift]: open})}
          position="fixed">
          <Toolbar className={classes.toolbar}>
            <IconButton className={clsx(classes.menuButton, open && classes.hide)}
              aria-label="menu"
              edge="start"
              color="inherit"
              onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
            {open? null: logo}
            {open? toolbarMenu: null}
            <div className={classes.toolButtonGroup}>
              <Link to="/settings">
                <Tooltip title="System Settings">
                  <IconButton>
                    <SettingsIcon className={classes.white}/>
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Project Site">
                <IconButton href="/" target="_blank">
                  <GitHubIcon className={classes.white}/>
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}>
          <div className={classes.drawerHeader}>
            {open? logo: null}
            <IconButton className={classes.white} onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
            </IconButton>
          </div>
          <Divider />
          <ThemeProvider theme={darkTheme}>
            <div className={classes.graphSettings}>
            </div>
          </ThemeProvider>
        </Drawer>
        <main className={clsx(classes.content, {[classes.contentShift]: open})}>
          <div className={classes.drawerHeader} />
          <Switch>
            <Route path="/">
              <FakeImageDetector setResult={setChatContent}/>
            </Route>
          </Switch>
        </main>
      </div>
      <MessageSnackbar queue={messageQueue}/>
      <ChatBot getContent={getChatContent}/>
    </ThemeProvider>
  );
}
