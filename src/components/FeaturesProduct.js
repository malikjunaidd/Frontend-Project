import * as React from 'react';
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



const Product = () => {
    
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);

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
      <div style={{ overflowX: 'hidden' }}>
       
            <h1>Features Products</h1>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto' }}
          label="Search by product name"
          variant="outlined"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            // console.log(searchText)
            // debugger;
            // if (e.target.value === '') {
               
            //   setData(originalData);
            // }
            // handleSearch()
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
        
        {/* <Button variant="contained" onClick={handleSearch} sx={{ mx: 'auto' }} >Search</Button> */}
        </Box>  
            <Grid container spacing={3} sx={{ml : 'auto'}} >
                {data.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.id}>
                       
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                alt={item.name}
                                height="140"
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
                                {item.category === "Sale" && <Button size="small">Add to Cart</Button>}
                                {item.category === "Auction" && <Button size="small" >Place Bid</Button>}
                            </CardActions>
                        </Card>
                    </Grid>                    
                ))}
            </Grid>
       
        </div>
    );
}

export default Product;