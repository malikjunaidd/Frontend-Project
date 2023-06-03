import  React, {useEffect, useState, useCallback} from 'react';
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
    
    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
        row.customer.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);

    const ConvertDate = (dd) => {
        const date = new Date(dd); // assuming "data" is your variable containing the date
        const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()} ${date.toLocaleTimeString()}`;
        return formattedDate;
    }
    useEffect(() => {
        axios.get('https://localhost:44392/api/Order/GetOrders', {
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
           <h1 style={{color : '#6BB2A1', fontFamily : 'cursive' }}>Admin Orders</h1>
           <Box sx={{ display: 'flex', float : 'left', alignItems: 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto', ml: '10%' }}
          label="Search by customer name"
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
        
        <Button variant="contained" onClick={handleSearch} sx={{ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  } }}>Search</Button>
        </Box>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Customer Name</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Product Name</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Total Price</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.customer.name} - {row.customer.email}
              </StyledTableCell>
              <StyledTableCell align="center">{ConvertDate(row.createdDate)}</StyledTableCell>
              <StyledTableCell align="center">{row.cart.product.name}</StyledTableCell>
              <StyledTableCell align="center">{row.cart.quantity}</StyledTableCell>
              <StyledTableCell align="center">{row.totalPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    );
}
export default Order