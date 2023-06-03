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
import { Button, TextField, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
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


export default function CustomizedTables() {
    const [customerData,setCustomerData] = useState([]);
    const [searchTextCustomer, setSearchTextCustomer] = useState('');
    const [originalDataCustomer, setOriginalDataCustomer] = useState([]);
    const [isSellerProgess, setIsSellerProgess] = useState(true);
    const [isCustomerProgess, setIsCustomerProgess] = useState(true);

    const [sellerData,setSellerData] = useState([]);
    const [searchTextSeller, setSearchTextSeller] = useState('');
    const [originalDataSeller, setOriginalDataSeller] = useState([]);

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Defaalut Value');
    const [severity, setSeverity] = useState('success');

    const handleSearchCustomer = useCallback(() => {
      setCustomerData(originalDataCustomer);
      const filteredData = originalDataCustomer.filter((row) =>
        row.name.toLowerCase().includes(searchTextCustomer.toLowerCase())
      );
      setCustomerData(filteredData);
    }, [originalDataCustomer, searchTextCustomer]);

    const handleSearchSeller = useCallback(() => {
      setSellerData(originalDataSeller);
      const filteredData = originalDataSeller.filter((row) =>
        row.name.toLowerCase().includes(searchTextSeller.toLowerCase())
      );
      setSellerData(filteredData);
    }, [originalDataSeller, searchTextSeller]);

    const ToggleCustomerBan = async (id) => {
        const response = await axios.put('https://localhost:44392/api/User/IsBanCustomer/'+id, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        // setcustomerData(customerData);
        console.log(response.data);
        const updatedcustomerData = await axios.get('https://localhost:44392/api/User/GetCustomers', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        setCustomerData(updatedcustomerData.data);
        setSeverity('success')
          setAlertOpen(true)

        // setRefresh(true)
    };
    const location = useLocation();
    const Id = location.state?.Id
    const ToggleSellerBan = async (id) => {
      const response = await axios.put('https://localhost:44392/api/User/IsBanSeller/'+id, {},  {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      // setcustomerData(customerData);
      console.log(response.data);
      const updatedsellerData = await axios.get('https://localhost:44392/api/User/GetSellers', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      setSellerData(updatedsellerData.data);

          setSeverity('success')
          setAlertOpen(true)

      // setRefresh(true)
  };

    useEffect(() => {
      console.log(Id)
        axios.get('https://localhost:44392/api/User/GetCustomers', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
      .then(response => {
        setIsCustomerProgess(false)
        setCustomerData(response.data);
        setOriginalDataCustomer(response.data);
      })
      .catch(error => {
        console.log(error);
      });
      axios.get('https://localhost:44392/api/User/GetSellers', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => {
        setIsSellerProgess(false)
        setSellerData(response.data);
        setOriginalDataSeller(response.data)
        
      })
      .catch(error => {
        console.log(error);
      });
    },[])

  return (
    <>
    <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Customers</h1>
    <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
    <Box sx={{ display: 'flex',float : 'left', alignItems: 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto', ml: '10%' }}
          label="Search by customer name"
          variant="outlined"
          value={searchTextCustomer}
          onChange={(e) => {
            setSearchTextCustomer(e.target.value);
            
            if (e.target.value === '') {
              setCustomerData(originalDataCustomer);
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
        
        <Button variant="contained" onClick={handleSearchCustomer} sx={{ ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  } }}>Search</Button>
        </Box>
   {!isCustomerProgess && <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Address</StyledTableCell>
            <StyledTableCell align="center">IsBan</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customerData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" align="center">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.address}</StyledTableCell>
              <StyledTableCell align="center">{row.isBan ? 'Yes' : 'No'}</StyledTableCell>
              <StyledTableCell align="center">
                <Button onClick={() => {
                   if(row.isBan)
                   {
                     setMessage('Customer has been Unbanned')
                   }
                   else
                   {
                     setMessage('Customer has been Banned')
                   }
                  const id = row.id;
                  ToggleCustomerBan(id)
                  }} variant="contained" sx={{ borderRadius : 5,
                    backgroundColor : '#6BB2A1',  
                    '&:hover': {
                  backgroundColor: '#988B47', // Change the color to your desired hover color
                }}}>{row.isBan ? 'Unban' : 'Ban' }</Button>
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>}
    {isCustomerProgess && <div style={{ display: 'flex', justifyContent: 'center',  height: '100vh', marginTop : '12%' }}>
        <CircularProgress />
      </div>
      }

    <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Sellers</h1>
    <Box sx={{ display: 'flex',float : 'left', alignItems: 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto', ml: '10%' }}
          label="Search by seller name"
          variant="outlined"
          value={searchTextSeller}
          onChange={(e) => {
            setSearchTextSeller(e.target.value);
            
            if (e.target.value === '') {
              setSellerData(originalDataSeller);
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
        
        <Button variant="contained" onClick={handleSearchSeller} sx={{  ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  } }}>Search</Button>
        </Box>
   {!isSellerProgess && <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Address</StyledTableCell>
            <StyledTableCell align="center">IsBan</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" align="center">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.address}</StyledTableCell>
              <StyledTableCell align="center">{row.isBan ? 'Yes' : 'No'}</StyledTableCell>
              <StyledTableCell align="center">
                <Button onClick={() => {
                   if(row.isBan)
                   {
                     setMessage('Seller has been Unbanned')
                   }
                   else
                   {
                     setMessage('Seller has been Banned')
                   }
                  const id = row.id;
                  ToggleSellerBan(id)
                  }} sx={{ borderRadius : 5,
                    backgroundColor : '#6BB2A1',  
                    '&:hover': {
                  backgroundColor: '#988B47', 
                }}} variant="contained">{row.isBan ? 'Unban' : 'Ban' }</Button>
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>}
    {isSellerProgess && <div style={{ display: 'flex', justifyContent: 'center',  height: '100vh', marginTop : '12%' }}>
        <CircularProgress />
      </div>
      }
    
    </>
  );
}