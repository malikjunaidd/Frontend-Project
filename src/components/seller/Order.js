import  React, {useEffect, useState, useCallback} from 'react';
import { Alert, Snackbar, Slide } from "@mui/material";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { Button, TextField,Box, InputAdornment } from '@mui/material';
import {  Dialog, DialogContent,  DialogContentText} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const Order = () => {
    
    const [data,setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [open, setOpen] = useState(false)
    const [map, setMap] = useState(null)

    const [alertOpen, setAlertOpen] = useState(false)
   const [message, setMessage] = useState('Defaalut Value');
   const [severity, setSeverity] = useState('success');
   const [center, setCenter] = useState({
    lat: 0,
    lng: 0
  })

    const location = useLocation();
    const Id = location.state?.Id
    //const Id = localStorage.getItem('Id');

    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
      row.cart.product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);

    const containerStyle = {
      width: '400px',
      height: '400px'
    };
    
    // const center = {
    //   lat: 33.56,
    //   lng: 73.01
    // };

    const { isLoaded } = useJsApiLoader({
      id: 'mapp-354003',
      googleMapsApiKey: "AIzaSyDPBZ7QC5Tv_GS6NHGszO50OU7QLb4RFnA"
    })

    const onLoad = React.useCallback(function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      console.log(center)
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
  
      setMap(map)
    }, [center])
  
    const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
    }, [center])

    const handleClick = async (id) => {
        console.log(id);
      await axios.put('https://localhost:44392/api/Order/ChangeSellerStatus/'+id, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
       .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
      });
      
      await axios.get('https://localhost:44392/api/Order/GetSellerOrders/' + Id, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => {
        setData(response.data);
        setOriginalData(response.data);
      })
      .then(() =>{
        setMessage('Order has been In Processing')
        setSeverity('success')
        setAlertOpen(true)
      })
      .catch(error => {
        console.log(error);
      });
     
    }
    useEffect(() => {
      console.log(Id)
      axios.get('https://localhost:44392/api/Order/GetSellerOrders/' + Id, {
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
    },[])
    

    return(
        <div>
           <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Seller Orders</h1>
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
        
        <Button variant="contained" onClick={handleSearch} sx={{borderRadius : 5,  ml: '10%',  backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  } }}>Search</Button>
        </Box>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Customer Name</StyledTableCell>
            <StyledTableCell align="center">Product Name</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Unit Price</StyledTableCell>
            <StyledTableCell align="center">Total Price</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.customer.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.cart.product.name}</StyledTableCell>
              <StyledTableCell align="center">{row.cart.quantity}</StyledTableCell>
              <StyledTableCell align="center">{row.cart.product.salePrice}</StyledTableCell>
              <StyledTableCell align="center">{row.totalPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.status}</StyledTableCell>
              <StyledTableCell align="center">{
              row.status == "Pending" && <Button variant='contained' sx={{
                borderRadius : 5,
                backgroundColor : '#6BB2A1',  
                '&:hover': {
              backgroundColor: '#988B47', // Change the color to your desired hover color
            }
              }} onClick={() => handleClick(row.id)}>In Process</Button>
              }
              <Button sx={{borderRadius : 5, ml:'2%',  backgroundColor : '#6BB2A1',  
      '&:hover': {
    backgroundColor: '#988B47', // Change the color to your desired hover color
  }}} variant='contained' onClick={() => {
                // setCenter((prevCenter) => ({
                //   ...prevCenter,
                //   lat: row.customer.latitude,
                //   lng: row.customer.longitude
                // }));
                setCenter({
                  lat: row.customer.latitude,
                  lng: row.customer.longitude
                })
                
                console.log(center)
                // center.lat = row.customer.latitude;
                // center.lng = row.customer.longitude;
                setOpen(true) 
              }}>Customer Location</Button>
              </StyledTableCell>
              <Dialog open={open} onClose={() => {
                    setOpen(false)
                }} >
                    <DialogContent>
                        <DialogContentText>
                        Customer Location
                        </DialogContentText>
                    {isLoaded && <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      ><Marker position={center} /></GoogleMap>
      }    
                    </DialogContent>

                    </Dialog>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    );
}
export default Order