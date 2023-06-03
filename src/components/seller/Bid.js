
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
import { TextField,Box, InputAdornment } from '@mui/material';
import { Button} from '@mui/material';
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

const Bid = () => {
    
    const [data,setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const location = useLocation();
    const Id = location.state?.Id
    // const Id = localStorage.getItem('Id');
    
    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
      row.product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);

    
    useEffect(() => {
        axios.get('https://localhost:44392/api/ProductBid/GetSellerBids/' + Id, {
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
           <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Seller Bids</h1>
           <Box sx={{ display: 'flex',float : 'left', alignItems: 'center', mb: 2}}>
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
        
        <Button variant="contained" onClick={handleSearch}sx={{ ml: '10%',  borderRadius : 5,
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
            <StyledTableCell align="center">Customer</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.product.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.bidPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.customer.name}</StyledTableCell>
              <StyledTableCell align="center"> {row.bidStatus} </StyledTableCell>

  
            </StyledTableRow>
            
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    );
}
export default Bid