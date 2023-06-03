import * as React from 'react';
import { Alert, Snackbar, Slide } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid from '@mui/material/Grid';
import {  Dialog, DialogContent,  DialogContentText, InputAdornment, Box} from '@mui/material';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import product from './product.png';

var sectionStyle = {
  height:'100vh',

 backgroundSize: '100% 100%',
 backgroundPosition: 'cover',

 backgroundRepeat: 'no-repeat',
 backgroundImage: `url(${product})`,
 
};

const Product = () => {
    
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [bidPrice, setBidPrice] = useState()
    const [quantity, setQuantity] = useState()
    const [open, setOpen] = useState(false)
    const [openQuantity, setOpenQuantity] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Defaalut Value');
    const [severity, setSeverity] = useState('success');

    const location = useLocation();
    const Id = location.state?.Id
  //  const Id = localStorage.getItem('Id');
  const handleSearch = useCallback(() => {
    setData(originalData);
    const filteredData = originalData.filter((row) =>
      row.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setData(filteredData);
  }, [originalData, searchText]);

    useEffect(() => {
      
        axios.get('https://localhost:44392/api/Product/GetProducts', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
            .then(response => {
                setData(response.data);
                setOriginalData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])
   
    const AddCart = (e,id, q) => {
        e.preventDefault();
        if(q < quantity)
        {
        //  alert('Please enter qunatity up to '+ q)
          setMessage('Please enter qunatity up to '+ q)
          setSeverity('error')
          setAlertOpen(true)
          return
        }
        if(quantity < 1)
        {
        //  alert('Qunatity must me greater than zero')
          setMessage('Qunatity must me greater than 0')
          setSeverity('error')
          setAlertOpen(true)
          return
        }
        const request = {
            customerId : Id,
            productId : id,
            quantity : quantity
        }
        try {
            axios.post('https://localhost:44392/api/Cart/CreateCart', request, {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            })
            .then(() =>{
              setMessage('Product has been added to the cart')
              setSeverity('success')
              setAlertOpen(true)
            })
            // console.log(response.data);
            setOpenQuantity(false)
          } catch (error) {
            console.error(error);
          }
    }
    const handleSubmit = (e,id, q) =>{
        debugger;
        e.preventDefault();
        if(bidPrice < q)
        {
         // alert('Please enter price greater than '+ q)
          setMessage('Please enter price greater than '+ q)
              setSeverity('error')
              setAlertOpen(true)
          return
        }
        const request = {
            customerId : Id,
            productId : id,
            bidPrice : bidPrice
        }
        try {
            axios.post('https://localhost:44392/api/ProductBid/CreateBid', request, {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            })
            .then(() =>{
              setMessage('Youy bid has been Created')
              setSeverity('success')
              setAlertOpen(true)
            })
          } catch (error) {
            console.error(error);
          }
          setOpen(false)
    }
    console.log(data)
    return (
      <div >
        <>
            <h1 style={{color : '#988B47',fontFamily : 'cursive' }}>Customer Products</h1>            
 <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
            <Box sx={{ display: 'flex',float : 'left', alignItems: 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto', ml: '10%' }}
          label="Search by product name"
          variant="outlined"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            
            if (e.target.value === '') {
              setData(originalData);
            }
        }
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
             <SearchIcon />
            </InputAdornment>
          ),
        }}
        />
        
        <Button variant="contained" sx={{  mx: 'auto', ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  }}} >Search</Button>
        </Box>  
            <Grid container spacing={3}>
                {data.map((item) => (

                    

                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                       
                        <Card sx={{ maxWidth: 345, backgroundColor : '#A6D0C2' }}>
                            <CardMedia
                                component="img"
                                alt={item.name}
                                height="250"
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
                            <Dialog open={open} onClose={() => setOpen(false)} BackdropProps={{ invisible: true }}>
  {/* <DialogTitle>Add Product</DialogTitle> */}
  <DialogContent>
    <DialogContentText>
      Please enter your bid price :
    </DialogContentText>
    <form onSubmit={(e) => handleSubmit(e,item.id, item.bidStartPrice)}>
      <TextField
        label="Bid Price"
        variant="outlined"
        type='number'
        value={bidPrice}
        onChange={(event) => setBidPrice(event.target.value)}
        margin="normal"
        required
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  </DialogContent>

</Dialog>
<Dialog open={openQuantity} onClose={() => {
    setOpenQuantity(false)
    setQuantity(1)
    } }BackdropProps={{ invisible: true }}>
  
  <DialogContent>
    <DialogContentText>
      Please enter your quantity and maxmimum qunatity available is {item.quantity}
    </DialogContentText>
    <form onSubmit={(e) => AddCart(e,item.id,  item.quantity)}>
      <TextField
        label="Qunatity"
        variant="outlined"
        type='number'
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        margin="normal"
        required
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  </DialogContent>

</Dialog>
                            <CardActions sx={{justifyContent : 'center'}}>
                                {/* {item.category === "Sale" && <Button size="small" onClick={(e) => AddCart(e,item.id)}>Add to Cart</Button>} */}
                                {item.category === "Sale" && <Button variant="contained" sx={{borderRadius : 5,
      backgroundColor : '#6BB2A1',  
      '&:hover': {
    backgroundColor: '#988B47', // Change the color to your desired hover color
  }}} size="small" onClick={() => setOpenQuantity(true)} >Add to Cart</Button>}
                                {item.category === "Auction" && <Button sx={{
                                  borderRadius : 5,
                                  backgroundColor : '#6BB2A1',  
                                  '&:hover': {
                                backgroundColor: '#988B47', // Change the color to your desired hover color
                              }
                                }} size="small" variant="contained" onClick={(e) => setOpen(true)}>Place Bid</Button>}
                            </CardActions>
                        </Card>
                    </Grid>
                    
                ))}
            </Grid>
        </>
        </div>
    );
}

export default Product;