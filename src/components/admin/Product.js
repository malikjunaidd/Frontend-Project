import  React, {useEffect, useState, useCallback} from 'react';
import { Alert, Snackbar, Slide } from "@mui/material";
import Typography from '@mui/material/Typography';
import admin from './admin.css'
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { InputAdornment, Button, TextField,Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontWeight : 'bold'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));
  
  
  
  // const headers =  {
  //     'content-type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('token')}`
  // }
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const Product = () => {
    
    const [data,setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Defaalut Value');
    const [severity, setSeverity] = useState('success');

    const [isProgess, setIsProgess] = useState(true)
 
    
    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
        row.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);
    const ToggleBan = async (id) => {
        const response = await axios.put('https://localhost:44392/api/Product/IsBanProduct/'+id, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        // setData(Data);
        console.log(response.data);
        const updatedData = await axios.get('https://localhost:44392/api/Product/GetAdminProducts', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        setData(updatedData.data);

          setSeverity('success')
          setAlertOpen(true)
        // setRefresh(true)
    };
    const location = useLocation();
    const Id = location.state?.Id

    useEffect(() => {
     console .log('Id is ', Id)
    
      axios.get('https://localhost:44392/api/Product/GetAdminProducts', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => {
        setIsProgess(false)
        setData(response.data);
        setOriginalData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    },[])

    return(
        <div>
           <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Admin Products</h1>
           <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   Product has been {message}
  </Alert>
</Snackbar>
          <Box sx={{ display: 'flex',float: 'left',alignItems : 'center', mb: 2}}>
        <TextField sx={{ mx: 'auto', ml: '10%' }}
          size="normal"
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
        
        <Button variant="contained" onClick={handleSearch} sx={{ ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  }}} >Search</Button>
        </Box>
        { !isProgess &&
        <div className='table-container'>            
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Sale Price</StyledTableCell>
            <StyledTableCell align="center">Bid Price</StyledTableCell>
            <StyledTableCell align="center">Is Product Sold?</StyledTableCell>
            <StyledTableCell align="center">Is Product Banned?</StyledTableCell>
            <StyledTableCell align="center">Image</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" align="center" >
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.category}</StyledTableCell>
              <StyledTableCell align="center">{row.salePrice}</StyledTableCell>
              <StyledTableCell align="center">{row.bidStartPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.isProductSold ? 'Yes' : 'No'}</StyledTableCell>
              <StyledTableCell align="center">{row.isBanned ? 'Yes' : 'No'}</StyledTableCell>
              <StyledTableCell align="center"><Box
        component="img"
        sx={{
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt="Product"
        src={row.filePath}
      /></StyledTableCell>
              <StyledTableCell align="center">
                <Button onClick={() => {
                  if(row.isBanned)
                  {
                    setMessage('Unbanned')
                  }
                  else
                  {
                    setMessage('Banned')
                  }
                  const id = row.id;
                  ToggleBan(id)                  
                  }} variant="contained" sx={{ borderRadius : 5,
                  backgroundColor : '#6BB2A1',  
                  '&:hover': {
                backgroundColor: '#988B47', // Change the color to your desired hover color
              }}}>{row.isBanned ? 'Unban' : 'Ban' }</Button>
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
}

{isProgess && <div style={{ display: 'flex', justifyContent: 'center',  height: '100vh', marginTop : '12%' }}>
        <CircularProgress />
      </div>
      }
        </div>
    );
}
export default Product