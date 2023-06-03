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
import { Button, TextField, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
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


const Complaint = () => {
    
    const ConvertDate = (dd) => {
        const date = new Date(dd); // assuming "data" is your variable containing the date
        const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()} ${date.toLocaleTimeString()}`;
        return formattedDate;
    }

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

    useEffect(() => {
        axios.get('https://localhost:44392/api/Complaint/GetComplaints', {
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
          <h1 style={{color : '#6BB2A1', fontFamily : 'cursive' }}>Admin Complaints</h1>
        <Box sx={{ display: 'flex',float : 'left', alignItems: 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto', ml: '10%' }}
          fullWidth
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
        
        <Button variant="contained" onClick={handleSearch} sx={{ ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  } }}>Search</Button>
        </Box>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Customer</StyledTableCell>
            <StyledTableCell align="center">Product Name</StyledTableCell>
            <StyledTableCell align="center">Seller</StyledTableCell>
            <StyledTableCell align="center">Date Time</StyledTableCell>
            <StyledTableCell align="center">Complain</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align='center' component="th" scope="row">
                {row.customer.name} - {row.customer.email}
              </StyledTableCell>
              <StyledTableCell align="center">{row.product.name}</StyledTableCell>
              <StyledTableCell align="center">{row.seller.name} - {row.seller.email}</StyledTableCell>
              <StyledTableCell align="center">{ConvertDate(row.complainDateTime) }</StyledTableCell>
              <StyledTableCell align="center">{row.complain }</StyledTableCell>
              
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    );
}
export default Complaint