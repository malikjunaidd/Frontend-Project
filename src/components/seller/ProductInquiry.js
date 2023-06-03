
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
import { TextField,Box, InputAdornment } from '@mui/material';
import { Button, Dialog, DialogContent,  DialogContentText} from '@mui/material';
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

const ProductInquiry = () => {
    
    const [data,setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [answer, setAnswer] = useState();
    const [open, setOpen] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Defaalut Value');
    const [severity, setSeverity] = useState('success');
   // const Id = localStorage.getItem('Id');
    const location = useLocation();
    const Id = location.state?.Id
    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
      row.customer.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);

    const handleClick = (id) => {
        setOpen(true)
    }
    
    const handleSubmit = async (e,id) =>{
      console.log(answer)
        e.preventDefault()
        await axios.put('https://localhost:44392/api/ProductInquiry/ResolveInquiry/'+id, answer , { headers: { 'Content-Type': 'application/json',  'Authorization': 'Bearer ' + localStorage.getItem('token') } })
        .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
      setOpen(false)
      await axios.get('https://localhost:44392/api/ProductInquiry/GetSellers/' +Id, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(response => {
        setData(response.data);
        setOriginalData(response.data);

        setMessage('Your answer has been submitted')
        setSeverity('success')
        setAlertOpen(true)
      })
      .catch(error => {
        console.log(error);
      });
          

      //  console.log(id);
    }
    useEffect(() => {
        axios.get('https://localhost:44392/api/ProductInquiry/GetSellers/' +Id, {
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
           <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Product Inquiry</h1>
           <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
           <Box sx={{ display: 'flex',float:'left', alignItems: 'center', mb: 2}}>
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
        
        <Button variant="contained" onClick={handleSearch} sx={{ borderRadius : 5, backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  }, ml: '10%' }}>Search</Button>
        </Box>
       
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Customer Name</StyledTableCell>
            <StyledTableCell align="center">Question</StyledTableCell>
            <StyledTableCell align="center">Answer</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.customer.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.question}</StyledTableCell>
              <StyledTableCell align="center">{row.answer}</StyledTableCell>
              {/* <StyledTableCell align="center">{row.answer == null && <Button variant='contained' onClick={() => handleClick(row.id)}>Answer</Button>}</StyledTableCell> */}
              <StyledTableCell align="center"><Button variant='contained' sx={{
                borderRadius : 5,
                 backgroundColor : '#6BB2A1',  
                 '&:hover': {
               backgroundColor: '#988B47', // Change the color to your desired hover color
             }
              }} onClick={() => handleClick(row.id)}>Answer</Button></StyledTableCell>
              <Dialog open={open} onClose={() => setOpen(false)} >
  {/* <DialogTitle>Add Product</DialogTitle> */}
  <DialogContent>
    <DialogContentText>
      Please enter the answer of this query:
    </DialogContentText>
    <form onSubmit={(e) => handleSubmit(e,row.id)}>
      <TextField
        label="Answering"
        variant="outlined"
        value={answer || ''}
        onChange={(event) => setAnswer(event.target.value)}
        margin="normal"
        required
        fullWidth
      />
    
      <Button type="submit" sx={{
         borderRadius : 5,
         backgroundColor : '#6BB2A1',  
         '&:hover': {
       backgroundColor: '#988B47', // Change the color to your desired hover color
     }
      }} variant="contained" color="primary">
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
export default ProductInquiry