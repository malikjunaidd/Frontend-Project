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
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, InputAdornment } from '@mui/material';
import {  Dialog, DialogContent,  DialogContentText} from '@mui/material';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
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

const Cart = () => {
    
    const [data,setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [question, setQuestion] = useState();
    const [open, setOpen] = useState(false)
    const [isempty, setIsEmpty] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Defaalut Value');
    const [severity, setSeverity] = useState('success');

    // const Id = localStorage.getItem('Id');
    const [openMap, setOpenMap] = useState(false)
    const [map, setMap] = useState(null)
    const [center, setCenter] = useState({
      lat: 0,
      lng: 0
    })
    const location = useLocation();
    const Id = location.state?.Id
    const navigate = useNavigate()

    const containerStyle = {
      width: '400px',
      height: '400px'
    };
    

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

    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
        row.product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    
      setData(filteredData);
    }, [originalData, searchText]);

    const Delete = async (e, id) => {
        e.preventDefault();
        console.log(id);
        await axios.delete('https://localhost:44392/api/Cart/DeleteCart/'+id, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(() =>{
          setMessage('Product has been removed from cart')
          setSeverity('success')
          setAlertOpen(true)
        })
        // setData(Data);
        // console.log(response.data);
        const updatedData = await axios.get('https://localhost:44392/api/Cart/GetCart/' + Id, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        setData(updatedData.data);
        setOriginalData(updatedData.data)
        // setRefresh(true)
    };
   
    const ConfirmOrder = async (e) => {
        e.preventDefault();
        const arr = []
        
       
        for(let i=0; i<originalData.length; i++)
        {
            arr[i] = originalData[i].id;
        }
        
        const dat = {
            cartIds : arr
        }
        await axios.post('https://localhost:44392/api/Order/CreateOrder', dat , { headers: { 'Content-Type': 'application/json',  'Authorization': 'Bearer ' + localStorage.getItem('token') } })
        .then(response => {
          setMessage('Your order has been confirm')
          setSeverity('success')
          setAlertOpen(true)
          navigate('/seller/order', { state: { Id: Id } });
          // setData(response.data);
          // setOriginalData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
      await axios.get('https://localhost:44392/api/Cart/GetCart/' +Id, {
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
      
    }
    const handleSubmit = (e,id) =>{
      e.preventDefault();
      const request = {
          customerId : Id,
          productId : id,
          question : question
      }
      try {
          axios.post('https://localhost:44392/api/ProductInquiry/MakeInquiry', request, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
          .then(() =>{
            setMessage('Your query has been sent to seller')
            setSeverity('success')
            setAlertOpen(true)
          })
         
          setOpen(false)
        } catch (error) {
          console.error(error);
        }
       
  }


    useEffect(() => {
      axios.get('https://localhost:44392/api/Cart/GetCart/' +Id, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => {
        setData(response.data);
        setOriginalData(response.data);
        if(response.data == null || response.data.length == 0)
        setIsEmpty(true)
      })
      .catch(error => {
        console.log(error);
      });
       
    
    },[])

    return(
        <div>
           <h1 style={{color : '#988B47',fontFamily : 'cursive' }}>Customers Cart</h1>
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
        
        <Button variant="contained" onClick={handleSearch} sx={{  ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  } }}>Search</Button>
        </Box>            
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Product Name</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Unit Price</StyledTableCell>
            <StyledTableCell align="center">Total Price</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.product.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.quantity}</StyledTableCell>
              <StyledTableCell align="center">{row.product.salePrice}</StyledTableCell>
              {/* <StyledTableCell align="center">{row.quantity}</StyledTableCell> */}
              {/* <StyledTableCell align="center">{row.product.salePrice}</StyledTableCell> */}
              <StyledTableCell align="center">{row.quantity * row.product.salePrice}</StyledTableCell>
              <StyledTableCell align="center"> <Button onClick={() => {
                // setCenter((prevCenter) => ({
                //   ...prevCenter,
                //   lat: row.product.seller.latitude,
                //   lng: row.product.seller.longitude
                // }));
                setCenter({
                  lat: row.product.seller.latitude,
                  lng: row.product.seller.longitude
                })
                setOpenMap(true)
                
                }} sx={{borderRadius : 5,
                  backgroundColor : '#6BB2A1',  
                  '&:hover': {
                backgroundColor: '#988B47', // Change the color to your desired hover color
              }}} variant="contained">Show Location</Button></StyledTableCell>
              <StyledTableCell align="center">
              <Button onClick={() => setOpen(true)} variant="contained" sx={{borderRadius : 5,
                  backgroundColor : '#6BB2A1',  
                  '&:hover': {
                backgroundColor: '#988B47', // Change the color to your desired hover color
              }}} >Ask Question</Button>
                <Button onClick={(e) => {   
                 Delete(e, row.id)
                  }} sx={{ml : '2%', borderRadius : 5,
                  backgroundColor : '#6BB2A1',  
                  '&:hover': {
                backgroundColor: '#988B47', // Change the color to your desired hover color
              }}} variant="contained">Delete</Button>

                </StyledTableCell>
                <Dialog open={openMap} onClose={() => {
                    setOpenMap(false)
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
                <Dialog open={open} onClose={() => {
                    setOpen(false)
                    setQuestion('')
                }} >
                    <DialogContent>
                        <DialogContentText>
                        Please enter your query here:
                        </DialogContentText>
                        <form onSubmit={(e) => handleSubmit(e, row.product.id)}>
                        <TextField
                            label="Write Your query"
                            variant="outlined"
                            type='text'
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
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
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button variant='contained' disabled={isempty} sx={{ mt : '1%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  }}} onClick={(e) => ConfirmOrder(e)}>Confirm Order</Button>
        </div>
    );
}
export default Cart