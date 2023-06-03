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
    // hide last border402
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const Bid = () => {
    
    const [data,setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [complain, setComplain] = useState();
    const [open, setOpen] = useState(false)
    const location = useLocation();

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Default Value');
    const [severity, setSeverity] = useState('success');

    const Id = location.state?.Id
  //  const Id = localStorage.getItem('Id');


    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
      row.product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);
   
      
       const handleSubmit = (e,id) =>{
        e.preventDefault();
        const request = {
            customerId : Id,
            productId : id,
            complain : complain
        }
        try {
            axios.post('https://localhost:44392/api/Complaint/MakeComplaint', request, {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            })
            .then(() =>{
              setMessage('Your complain has been registered')
          setSeverity('success')
          setAlertOpen(true)
            })
            setOpen(false)
          } catch (error) {
            console.error(error);
          }
    }

    useEffect(() => {
      axios.get('https://localhost:44392/api/ProductBid/GetCustomerBids/' + Id, {
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
           <h1 style={{color : '#988B47', fontFamily : 'cursive' }}>Awarded Bids</h1>
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
            <StyledTableCell align="center">Bid Amount</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" align="center">
                 {row.product.name }
              </StyledTableCell>
              <StyledTableCell align="center">{row.bidPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.bidStatus}</StyledTableCell>
              <StyledTableCell align="center">

                <Button  variant="contained" sx={{ml:'2%', borderRadius : 5,
                  backgroundColor : '#6BB2A1',  
                  '&:hover': {
                backgroundColor: '#988B47', // Change the color to your desired hover color
              }}} onClick={() => setOpen(true)}>Register Complain</Button>
                </StyledTableCell>
                <Dialog open={open} onClose={() => {
                    setOpen(false)
                    setComplain('')
                }} >
                    <DialogContent>
                        <DialogContentText>
                        Please enter your Complain :
                        </DialogContentText>
                        <form onSubmit={(e) => handleSubmit(e, row.product.id)}>
                        <TextField
                            label="Write Complain"
                            variant="outlined"
                            type='text'
                            value={complain}
                            onChange={(event) => setComplain(event.target.value)}
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

        </div>
    );
}
export default Bid