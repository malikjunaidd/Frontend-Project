// import register from './register.png'
import register from './register.png'
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

var sectionStyle = {
    minHeight: '100vh',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${register})`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center' 
 
 
};

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  // margin-top: 50px;
  padding: 30px;
  width: 80%;
  max-width: 500px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 20px;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: 20px;
`;



const SignUp = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(false)
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [productsType, setProductsType] = useState('');
  const [productsTypeError, setProductsTypeError] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    }); 
  }, [])
  

  const handleToggle = () => {
    setIsSeller(!isSeller);
  };
  const SendData = (e) => {
    e.preventDefault();
    if(email == '')
    setEmailError(true)

    if(name == '')
      setNameError(true)

    if(phoneNumber == '')
    setPhoneNumberError(true)

    if(password == '')
    setPasswordError(true)

    if(password !== '' && confirmPassword == '')
    setConfirmPasswordError(true)

    if(address == '')
    setAddressError(true)

    if(isSeller == true && productsType == '')
    {
      setProductsTypeError(true);
      return;
    }
    
    if(nameError || confirmPasswordError || phoneNumberError || emailError || passwordError || addressError)
    {
      return;
    }
    
        
    const data = {
      name : name,
      email : email,
      password : password,
      phoneNumber : phoneNumber,
      address : address,
      businessName : businessName,
      productsType : productsType,
      latitude : latitude,
      longitude : longitude
    }
    console.log(data)
    if(isSeller == true)
    {
      try {
        axios.post('https://localhost:44392/api/Auth/register-seller', data)
        .then(res => {
          console.log(res);
          navigate('/login');
        });
       
      } catch (error) {
        console.error(error);
      }
    }
    else{
      try {
        data.productsType = undefined
        data.businessName = undefined
        axios.post('https://localhost:44392/api/Auth/register-customer', data)
        .then(res => {
          console.log(res);
          navigate('/login');
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div style={sectionStyle}>
      <StyledTypography variant="h2" component="h1" sx={{
   fontWeight: 'bolder',
   color: '#C7A317',
   // marginTop: { xs: '0.1rem', sm: '0.2rem', md: '0.3rem' },
   fontSize: '2.5rem'
 }}>
   Create your Account
 </StyledTypography>
   
    <Grid container alignItems="center" justifyContent="center"  sx={{display : 'flex', float : 'right'}}>
      <Grid item xs={12} sm={8} md={6} >
        <StyledPaper elevation={3} sx={{ backgroundColor : '#F4F4F4'}}>
          <StyledTypography variant="h5" component="h1" align="center">
            Sign Up as a {isSeller ? 'Seller' : 'Customer'}
          </StyledTypography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField type='text' label="Name" fullWidth margin="normal" value={name} onChange = {(e) => setName(e.target.value)} 
               error={nameError}
               helperText={nameError && 'Name should not contain any number or special character'}
               onBlur={(e) => {
                 const numberregex = /^[a-zA-Z ]+$/; 
                 const value = e.target.value;
                 if (!numberregex.test(value)) {
                   setNameError(true);
                  
                 } else {
                   setNameError(false);
                  
                 }
               }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange = {(e) => setEmail(e.target.value)}
               error={emailError}
               helperText={emailError && 'Invalid email address'}
               placeholder='example@gmail.com'
               onBlur={(e) => {
                 const emailValue = e.target.value;
                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                 if (!emailRegex.test(emailValue)) {
                   setEmailError(true);
                  
                 } else {
                   setEmailError(false);
                  
                 }
               }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange = {(e) => setPassword(e.target.value)} 
              error={passwordError}
              helperText={passwordError && 'Invalid password'}
              placeholder='Password (8+ chars, 1 cap, 1 special)'
              onBlur={(e) => {
                const passwordValue = e.target.value;
                const passwordRegex = /^(?=.*[A-Z])(?=.*[+-/^!@#$&*])(?=.{8,})/;
                if (!passwordRegex.test(passwordValue)) {
                  setPasswordError(true);
                } else {
                  setPasswordError(false);
                }
              }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Confirm Password" type="password" fullWidth margin="normal"
               value={confirmPassword} 
               onChange = {(e) => setConfirmPassword(e.target.value)}
               error={confirmPasswordError}
               helperText={confirmPasswordError && 'Password does not match'}
               onBlur={(e) => {
                // e.preventDefault();
                 const value = e.target.value;
                
                 if (password !== value) {
                   setConfirmPasswordError(true);
                 } else {
                   setConfirmPasswordError(false);
                 }
               }}
              //  error={confirmPassword !== null && password !== confirmPassword}
              //  helperText={password !== null  && password !== confirmPassword && 'Password does not match'} 
               />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone No" type="tel" fullWidth margin="normal" value={phoneNumber} onChange = {(e) => setPhoneNumber(e.target.value)} 
               error={phoneNumberError}
               placeholder='0xxxxxxxxxx'
               helperText={phoneNumberError && 'Invalid Phone Number'}
               onBlur={(e) => {
                 const value = e.target.value;
                 const regex = /^\d{11}$/;
                 if (!regex.test(value)) {
                   setPhoneNumberError(true);
                 } else {
                   setPhoneNumberError(false);
                 }
               }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Address" type="text" fullWidth margin="normal" value={address}
              onChange = {(e) => setAddress(e.target.value)} 
              error={addressError}
              helperText={addressError && 'Please Enter the Address'}
              onBlur={(e) => {
                 const value = e.target.value;
                
                 if (value === '') {
                   setAddressError(true);
                 } else {
                  setAddressError(false);
                 }
               }}
              multiline
              maxRows={4}
              />
            </Grid>
            {isSeller && (
              <>
                {/* <Grid item xs={12}>
                  <TextField label="Business Name" fullWidth margin="normal" value={businessName} onChange = {(e) => setBusinessName(e.target.value)} />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField 
                  label="Type of Products/Services" 
                  fullWidth margin="normal" 
                  value={productsType} 
                  onChange = {(e) => setProductsType(e.target.value)}
                  error={productsTypeError}
                  helperText={productsTypeError && 'Please Enter the Product Type'}
                  onBlur={(e) => {
                    const value = e.target.value;                   
                    if (value === '') {
                      setProductsTypeError(true);
                    } else {
                      setProductsTypeError(false);
                    }
                  }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <StyledFormControlLabel
            control={<Switch checked={isSeller} onChange={handleToggle} />}
            label="Are you a Seller?"
          />
          <Button variant="contained" color="primary" fullWidth margin="normal" onClick={(e) => SendData(e)}>
            Sign Up
          </Button>
        </StyledPaper>
      </Grid>
    </Grid>
    </div>
  );
};

export default SignUp;
