import { Alert, Snackbar, Slide } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar } from '@mui/material';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './seller.css';
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
import back from './back.png'
import menu from './menu.png'
import stripe from './stripe.png'
import ListItemText from '@mui/material/ListItemText';
// import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NoAccountsTwoToneIcon from '@mui/icons-material/NoAccountsTwoTone';
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';
import HandymanTwoToneIcon from '@mui/icons-material/HandymanTwoTone';
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';

const drawerWidth = 240;

var sectionStyle = {
  minHeight: '100vh',
  backgroundSize: '100% 100%',
  backgroundPosition: 'center center',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  // backgroundColor : '#D3D3D3'
  backgroundImage: `url(${back})`,
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'center'  
};

function Dashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false)

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState('Defaalut Value');
  const [severity, setSeverity] = useState('success');

  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    setMessage('You have been login successfully')
          setSeverity('success')
          setAlertOpen(true)
  }, [])
   
  const drawer = (
    <div>
     <div style={{display : 'flex', justifyContent : 'center', marginTop : 5}}>
      <Avatar
      alt="Logo"
      src={require('../loggo.png')}
      sx={{ width: 150, height: 100 }}
    />
    </div>
      <Divider />
      <List>
        {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}
        <ListItem disablePadding>
          <Link to="/seller" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <HandymanTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Products' />
              </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/seller/order" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <LocalMallTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Orders' />
              </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/seller/productInquiry" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <ChatTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Product Inquiry' />
              </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link to="/seller/bid" state={{Id: location.state?.Id  }} onClick={handleDrawerToggle} className="no-style-link">
            <ListItemButton>
              <ListItemIcon>
              <AttachMoneyTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary='Bid' />
              </ListItemButton>
          </Link>
        </ListItem>

        </List>
        
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}

      </List> */}
    </div>
  );


  const container = window !== undefined ? () => window().document.body : undefined;

  return authenticated && (
    <div style={sectionStyle}>
    <Box sx={{ display: 'flex' }}>
       <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundImage: `url(${stripe})`,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
            Seller Dashboard
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,backgroundImage: `url(${menu})` },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundImage: `url(${menu})` },
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