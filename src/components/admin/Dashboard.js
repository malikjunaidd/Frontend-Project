import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import './admin.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar } from '@mui/material';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import dashboard from './dashboard.png'
import dashboard from './back.png'
import menuImage from './menu.png'
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon  from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect } from "react";
import top from './top.png'
// import menuImage from './menu.png'
import { useLocation } from "react-router-dom";
import NoAccountsTwoToneIcon from '@mui/icons-material/NoAccountsTwoTone';
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';
import HandymanTwoToneIcon from '@mui/icons-material/HandymanTwoTone';
import Groups2TwoToneIcon from '@mui/icons-material/Groups2TwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';

import { Alert, Snackbar, Slide } from "@mui/material";


const drawerWidth = 240;

var sectionStyle = {
  minHeight: '100vh',
  backgroundSize: '100% 100%',
  backgroundPosition: 'center center',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  // backgroundColor : '#D3D3D3'
  backgroundImage: `url(${dashboard})`,
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'center'  
};

function Dashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false)

   const [alertOpen, setAlertOpen] = useState(false)
   const [message, setMessage] = useState('Defaalut Value');
   const [severity, setSeverity] = useState('success');

  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/');   
  };
  const location = useLocation();
  useEffect(() => {

    if(location.state?.Id == null || location.state?.Id == undefined)
    {
      navigate('/login')
    }
    else{
      setAuthenticated(true)
    }
    setMessage('You have been login successfully ')
    setSeverity('success')
    setAlertOpen(true)
  }, [])
  const handleClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const drawer = (
    <div>
      {/* <Toolbar /> */}
      {/* <img src={require('./AUTOMOBILES.png')}  alt="logo" /> */}
      {/* <img  alt="Logo"
      src={require('./AUTOMOBILES.png')} width="200" height="150"/> */}
      <div style={{display : 'flex', justifyContent : 'center', marginTop : 5}}>
      <Avatar
      alt="Logo"
      src={require('../loggo.png')}
      sx={{ width: 150, height: 100 }}
    />
      {/* <Toolbar /> */}
      </div>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Link to="/admin" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <HandymanTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Products' />
              </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/admin/user" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <Groups2TwoToneIcon/>
            </ListItemIcon>
            <ListItemText primary='Users' />
              </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/admin/order" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <LocalMallTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Orders' />
              </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/admin/complaint" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <CommentTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Complaints' />
              </ListItemButton>
          </Link>
        </ListItem>

        </List>
        
       {/* <Divider /> */}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return authenticated && (
    <div style={sectionStyle}>
    <Box sx={{ display: 'flex' }}>
       <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundImage: `url(${top})`,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          // backgroundColor : '#808080'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => setOpen(true)} sx={{ ml: 'auto' }} startIcon={ <NoAccountsTwoToneIcon />}>
          Logout
         </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogContent>
          {/* Add any additional content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundImage: `url(${menuImage})` },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,  backgroundImage: `url(${menuImage})`},
           
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {/* <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus no
        </Typography> */}
        <Outlet />
      </Box>
    </Box>
    </div>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Dashboard;