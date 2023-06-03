import React from 'react';
import { AppBar, Toolbar, Typography, Container,  styled } from '@mui/material';
import { TextField, Button, Box } from '@mui/material';
import { Carousel } from './Carousel'
import Footer from './Footer'
import { Avatar } from '@mui/material';
import FeatureProduct from './FeaturesProduct'
import logo from './loggo.png'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from '@mui/material/Grid';
import {  Dialog, DialogContent,  DialogContentText, InputAdornment} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom : '-1%',
  backgroundColor: theme.palette.common.white,
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
}));

const HeaderToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const LogoTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '1.5rem',
}));

const SearchTextField = styled(TextField)({
  width: '300px',
  marginRight: '16px',
});

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));


const Home = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [originalData, setOriginalData] = useState([]);

  const navigate = useNavigate()

  const handleSearch =() => {
  setData(originalData);
  const filteredData = originalData.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );
  setData(filteredData);
};

  useEffect(() => {
    
      axios.get('https://localhost:44392/api/Auth/GetHomeProducts')
          .then(response => {
              setData(response.data);
              setOriginalData(response.data);
          })
          .catch(error => {
              console.log(error);
          });
  }, [])
  useEffect(() => {
      handleSearch();
    }, [searchText]);
  return (
    // <FeatureProduct />
    <div style={{backgroundColor : '#DBEEE9'}}>
      
      <HeaderAppBar position="sticky" sx={{ backgroundColor: '#A6D0C2' }}>
  <HeaderToolbar>
    <Box display="flex" alignItems="center">
      {/* Logo */}
      <LogoTypography variant="h6" component="div">
        {/* Your Logo */}
        <Avatar src={logo} alt="Your Logo" sx={{ width: 170, height: 100 }} />
      </LogoTypography>
    </Box>

    {/* Search Bar */}
    <SearchTextField
      label="Search by product name"
      variant="outlined"
      value={searchText}
      size="small"
      onChange={(e) => {
        setSearchText(e.target.value);
      }}
    />

    {/* Login Button */}
    <Box display="flex" alignItems="center">
      <Button sx={{borderRadius : 5,
      backgroundColor : '#6BB2A1',  
      '&:hover': {
    backgroundColor: '#988B47', // Change the color to your desired hover color
  }}} variant="contained" startIcon={<LoginIcon />} onClick={() => navigate('/login')} 
      
      > Login</Button>
      <Typography variant="h6" component="span" sx={{ color: 'black', fontSize: '25px', fontWeight: 'bold', mx: 1, visibility : 'hidden' }}>
        |
      </Typography>
      <Button sx={{borderRadius : 5,
      backgroundColor : '#6BB2A1',  
      '&:hover': {
    backgroundColor: '#988B47', // Change the color to your desired hover color
  }}} startIcon={<PersonIcon />} 
  variant="contained" onClick={() => navigate('/register')}>Sign Up</Button>
    </Box>
  </HeaderToolbar>
</HeaderAppBar>

    <Carousel />
    <div style={{ overflowX: 'hidden', marginBottom : 12 }}>
       
       <h1 style={{color :'#988B47'}}>Our Features Products</h1>
       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
   {/* <TextField sx={{ mx: 'auto' }}
     label="Search by product name"
     variant="outlined"
     value={searchText}
     onChange={(e) => {
       setSearchText(e.target.value);
   }
   }
   InputProps={{
     startAdornment: (
       <InputAdornment position="start">
        <SearchIcon />
       </InputAdornment>
     ),
   }}
   /> */}
   
   {/* <Button variant="contained" onClick={handleSearch} sx={{ mx: 'auto' }} >Search</Button> */}
   </Box>  
       <Grid container spacing={3} sx={{ml : 'auto'}} >
           {data.map((item) => (
               <Grid item xs={12} sm={6} md={3} key={item.id}>
                  
                   <Card sx={{ maxWidth: 345, backgroundColor : '#A6D0C2' }}>
                       <CardMedia
                           component="img"
                           alt={item.name}
                           height="270"
                           image={item.filePath}
                           // sx={{
                           //     position: 'relative',
                           //   }}
                       />
                        {/* <Typography variant="h3" color="text.secondary"
                               sx={{
                               position: 'absolute',
                               top: 0,
                               right: 0,
                               backgroundColor: 'rgba(0, 0, 255, 0.5)',
                               color: 'text.secondary',
                               padding: '2px 4px',
                               borderRadius: '0 0 0 10px',
                               fontSize: '1rem',
                               fontWeight: 'bold',
                               zIndex: 1,
                               }}
                           >
                               {item.salePrice.toString()}
                              
                           </Typography> */}
                       <CardContent>
                           <Typography gutterBottom variant="h5" component="div">
                               {item.name}
                           </Typography>
                           <Typography gutterBottom variant="h4" component="div">
                               {item.salePrice || item.bidStartPrice}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                               {item.description}
                           </Typography>
                       </CardContent>
                       <CardActions sx={{justifyContent : 'center'}}>
                           {/* {item.category === "Sale" && <Button size="small" onClick={(e) => AddCart(e,item.id)}>Add to Cart</Button>} */}
                           {item.category === "Sale" && <Button onClick={() => navigate('/login')}  size="small">Add to Cart</Button>}
                           {item.category === "Auction" && <Button onClick={() => navigate('/login')}  size="small" >Place Bid</Button>}
                       </CardActions>
                   </Card>
               </Grid>                    
           ))}
       </Grid>
  
   </div>
      
       
      <Footer />
    </ div>
  );
};

export default Home;

