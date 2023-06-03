import  React, {useEffect, useState, useCallback, useRef} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete';
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
import { Switch, FormControlLabel ,Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, useTheme, useMediaQuery, MenuItem } from '@mui/material';
import Webcam from "react-webcam";
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
  const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: 20px;
`;
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
    const [open, setOpen] = useState(false);
    const [productFormOpen, setProductFormOpen] = useState(false)
    const theme = useTheme();
    
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const webcamRef = useRef(null);
    const [toggleImage, setToggleImage] = useState(false)
    const [showWebcam, setShowWebcam] = useState(true);
    const [id, setId] = useState();
    const [productName, setProductName] = useState();
    const [productDescription, setProductDescription] = useState();
    const [category, setCategory] = useState('Sale');
    const [image, setImage] = useState(null);
    const [salePrice, setSalePrice] = useState();
    const [quantity, setQuantity] = useState(1);
    const [bidPrice, setBidPrice] = useState();
    const [bidEndDate, setBidEndDate] = useState();
    const [toggleAction, setToggleAction] = useState();
    const location = useLocation();
    const Id = location.state?.Id
    // const Id = localStorage.getItem('Id');

    const [alertOpen, setAlertOpen] = useState(false)
   const [message, setMessage] = useState('Defaalut Value');
   const [severity, setSeverity] = useState('success');
   

    const capture = (e) => {
    e.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();
   
    setImage(imageSrc);
    setShowWebcam(false)
 
  };

  function dataURLtoFile(dataURL, filename) {
    if (!dataURL) {
      return null;
    }
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  

  const handleDelete = async (id) => {

    await axios.delete('https://localhost:44392/api/Product/DeleteProduct/'+id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(response => {
        console.log(response.data);
        setOpen(false);
      })
      .catch(error => {
        console.log(error);
      })
      await axios.get('https://localhost:44392/api/Product/GetSellerProducts/'+ Id, {
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
      })
      .then(() =>{
        setMessage('Product has been deleted Successfully')
        setSeverity('success')
        setAlertOpen(true)
      })
          
}
    const handleSearch = useCallback(() => {
      setData(originalData);
      const filteredData = originalData.filter((row) =>
        row.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }, [originalData, searchText]);

    const handleUpdate = (e, id) =>{
      e.preventDefault()
      setProductFormOpen(true);
      axios.get('https://localhost:44392/api/Product/GetSingleProduct/'+id, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => {
        const res = response.data;
        console.log(response)
        setProductName(res.name )
        setQuantity(res.quantity)
        setProductDescription(res.description)
        setCategory(res.category)
        setSalePrice(res.salePrice)
        setBidPrice(res.bidStartPrice)
        setBidEndDate(res.bidEndDate)
        setId(res.id)
      })
      .catch(error => {
        console.log(error);
      });
    }

    const formData = {
      sellerId : Id,
      name : productName,
      description : productDescription,
      category : category,
      quantity : quantity,
      salePrice : salePrice,
      bidStartPrice : bidPrice,
      bidEndDate : bidEndDate,
      file : dataURLtoFile(image, productName +".jpg")
    }

    const handleSubmit = async (e) => {
      
      e.preventDefault();
      setProductFormOpen(false)
      console.log(formData)
      if(formData.category === 'Sale')
      {
        formData.bidStartPrice =  null
        formData.bidEndDate = null
      }
      else{
        formData.salePrice = null
      }
      console.log(data)
      if(toggleAction == 'add')
      {
      try {
          await axios({
          method: "post",
          url: "https://localhost:44392/api/Product/CreateProduct",
          data: formData,
          headers: { "Content-Type": "multipart/form-data",  'Authorization': 'Bearer ' + localStorage.getItem('token') },
        })
        .then(() => {
          setMessage('Product has been Added Successfully')
          setSeverity('success')
          setAlertOpen(true)
        })
      } catch(error) {
        console.log(error)
      }
      
      }
      else{
         try {
          await axios({
          method: "put",
          url: "https://localhost:44392/api/Product/UpdateProduct/" +id,
          data: formData,
          headers: { "Content-Type": "multipart/form-data",  'Authorization': 'Bearer ' + localStorage.getItem('token') },
        })
        .then(() =>{
          setMessage('Product has been Updated Successfully')
          setSeverity('success')
          setAlertOpen(true)
        } )
      } catch(error) {
        console.log(error)
      }
      
      }
    
      axios.get('https://localhost:44392/api/Product/GetSellerProducts/'+ Id, {
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
  
    useEffect(() => {
         console.log('ID --->',Id)
        axios.get('https://localhost:44392/api/Product/GetSellerProducts/'+ Id, {
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
        <h1 style={{color : '#6BB2A1',fontFamily : 'cursive' }}>Seller Products</h1>
        <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
        <Box sx={{ display: 'flex', alignItems: 'self-start', mb: 2}}>
        <Box sx={{ display: 'flex',float:'left', alignItems: 'center', mb: 2}}>
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
        
        <Button sx={{ ml: '10%', borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  }}} variant="contained" onClick={handleSearch} >Search</Button>
        </Box>
        <Button variant='contained' startIcon={<AddIcon />} onClick={() => {
          setToggleAction('add')
          setProductFormOpen(true)
          }} sx={{ mx: 'auto', borderRadius : 5,
          backgroundColor : '#988B47',  
          '&:hover': {
        backgroundColor: '#6BB2A1', // Change the color to your desired hover color
      }}}>Add Product</Button>
        </Box>
        <Dialog open={productFormOpen} onClose={() => 
        {
        setProductFormOpen(false)
        setProductName('')
        setImage(null)
        setShowWebcam(true)
        setProductDescription('')
        setQuantity(1)
        setCategory('')
        setSalePrice(0)
        setBidPrice(0)
        setBidEndDate('')
        }} fullScreen={fullScreen}>
  <DialogTitle>Add Product</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Please enter the details of the new product:
    </DialogContentText>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Product Name"
        variant="outlined"
        value={productName || ''}
        onChange={(event) => setProductName(event.target.value)}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Product Description"
        variant="outlined"
        value={productDescription || ''}
        onChange={(event) => setProductDescription(event.target.value)}
        margin="normal"
        required
        fullWidth
      />
      <div>
      <StyledFormControlLabel
            control={<Switch checked={toggleImage} onChange={() => {
              setImage(null)
            if(toggleImage === false)
            {
              setShowWebcam(true)
            }
            setToggleImage(!toggleImage)
            
            
            }} />}
            label="Do you want to capture image?"
      />
     {!toggleImage && <TextField
       // label="Product Image"
        variant="outlined"
        type="file"
        // onChange={(event) => {
        //   if (event.target.files[0]) {
        //     setImage(event.target.files[0])
        //   }
        // }}
        onChange={(event) => {
          if (event.target.files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
              setImage(e.target.result)
            }
            reader.readAsDataURL(event.target.files[0])
          }
        }}
        margin="normal"
       // required
        fullWidth
      />}
     
    {toggleImage && <><div> {showWebcam && <><Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={capture}
        sx={{ borderRadius : 5,
          backgroundColor : '#6BB2A1',  
          '&:hover': {
        backgroundColor: '#988B47', // Change the color to your desired hover color
      }}}
      >Capture
      </Button>
      </>}
      </div>
      <div>
      {image && <img src={image} alt="Captured" />}
      </div>
      </>
      }
      </div> 
       <TextField
        label="Category"
        variant="outlined"
        select
        defaultValue="Sale"
        onChange={(event) => setCategory(event.target.value)}
        margin="normal"
        required
        fullWidth
      >
         <MenuItem value="Sale">
              Sale
            </MenuItem>
            <MenuItem value="Auction">
              Auction
            </MenuItem>
      </TextField>
       {category === "Sale" && <><TextField
        label="Sale Price"
        variant="outlined"
        type="number"
        value={salePrice || ''}
        onChange={(event) => setSalePrice(event.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Qunatity"
        variant="outlined"
        type="number"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        margin="normal"
        fullWidth
      />
      </>
      }
       {category === "Auction" && <><TextField
        label="Bid Start Price"
        variant="outlined"
        type="number"
        value={bidPrice || ''}
        onChange={(event) => setBidPrice(event.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Bid End Date"
        variant="outlined"
        type="date"
        value={bidPrice || ''}
        onChange={(event) => setBidEndDate(event.target.value)}
        margin="normal"
        fullWidth
      /></>}
      <Button type="submit" variant="contained" color="primary" sx={{ borderRadius : 5,
      backgroundColor : '#988B47',  
      '&:hover': {
    backgroundColor: '#6BB2A1', // Change the color to your desired hover color
  }}}>
        Submit
      </Button>
    </form>
   
  </DialogContent>
  
</Dialog>
            
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Sale Price</StyledTableCell>
            <StyledTableCell align="center">Bid Price</StyledTableCell>
            <StyledTableCell align="center">Bid End Date</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Is Product Sold?</StyledTableCell>
            <StyledTableCell align="center">Image</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.category}</StyledTableCell>
              <StyledTableCell align="center">{row.salePrice}</StyledTableCell>
              <StyledTableCell align="center">{row.bidStartPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.bidEndDate}</StyledTableCell>
              <StyledTableCell align="center">{row.quantity}</StyledTableCell>
              <StyledTableCell align="center">{row.isProductSold ? 'Yes' : 'No'}</StyledTableCell>
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
                <Button startIcon={<EditIcon />} variant="contained" onClick={(e) => {
                  setToggleAction('update')
                  handleUpdate(e, row.id)}} sx={{ borderRadius : 5,
                  backgroundColor : '#6BB2A1',  
                  '&:hover': {
                backgroundColor: '#988B47', // Change the color to your desired hover color
              }}}>Edit </Button>&nbsp;


                <Button sx={{ borderRadius : 5,
      backgroundColor : '#6BB2A1',  
      '&:hover': {
    backgroundColor: '#988B47', // Change the color to your desired hover color
  }}} startIcon={<DeleteIcon />} variant="contained" onClick={() => setOpen(true)}>Delete</Button>
                <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this resource?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(row.id)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    );
}
export default Product