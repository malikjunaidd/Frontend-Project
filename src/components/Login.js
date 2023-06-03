import login from './log.png'
import { Alert, Snackbar, Slide } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {

 
 var sectionStyle = {
    minHeight: '100vh',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${login})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'    
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false)
  const [message, setMessage] = useState('Defaalut Value');
  const [severity, setSeverity] = useState('success');
  
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate()

  useEffect(() =>{
    console.log("Redendering")
  },[])

  const handleSubmit = (event) => {
     //   debugger;
        event.preventDefault();
        if(email == '')
        setEmailError(true)
        if(emailError || passwordError)
        {
          return
        }
       
       
        const data = {
          email : email,
          Password : password
        }

        
        console.log(data);
       
          axios.post('https://localhost:44392/api/Auth/login', data)
          .then(res => {
            debugger;
            console.log(res.data);
            
            const role = res.data.role;
            console.log(role)
            
            localStorage.setItem("Id", res.data.id);
            localStorage.setItem("token", res.data.token)
          
            
            if (role === "Seller") {
                  navigate('/seller', { state: { Id: res.data.id } });
                }
            else if (role === "Customer") {
                  navigate('/customer',  { state: { Id: res.data.id } });
                  
                } 
            else if (role === "Admin") {
                  navigate('/admin', { state: { Id: res.data.id } });
                }
              return;
          })
          .catch(error =>{
            setMessage('Email or Password does not Match')
            setSeverity('error')
            setAlertOpen(true)
          })        
       };

  return (
  <div  style={sectionStyle}>
    <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
      <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
      {message}
      </Alert>
    </Snackbar>
  <Container component="main" maxWidth="sm" sx={{mt : '9%',display : 'flex', justifyContent: 'center'}}>
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
       //   marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor : '#F4F4F4'
        }}
      >
        <Typography component="h1" variant="h4">
          Log In
        </Typography>
        <Box component="form" onSubmit={e => handleSubmit(e)} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            placeholder='example@gmail.com'
            name="email"
            value={email}
            error={emailError}
            helperText={emailError && 'Invalid email address'}
            onBlur={(e) => {
              const emailValue = e.target.value;
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(emailValue)) {
                setEmailError(true);
               
              } else {
                setEmailError(false);
               
              }
            }}
            
            onChange={(e) => {
              const value = e.target.value;
             
                setEmail(value);
             
            }}
            autoComplete="email"
          //  autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            // type="password"
            type={showPassword ? 'text' : 'password'}
            placeholder='Password (8+ chars, 1 cap, 1 special)'
            id="password"
            value={password}
            error={passwordError}
            helperText={passwordError && 'Invalid password'}
            onBlur={(e) => {
              const passwordValue = e.target.value;
              const passwordRegex = /^(?=.*[A-Z])(?=.*[+-/^!@#$&*])(?=.{8,})/;
              if (!passwordRegex.test(passwordValue)) {
                setPasswordError(true);
              } else {
                setPasswordError(false);
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              // if (passwordRegex.test(value)) {
                setPassword(value);
              // }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordToggle}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="current-password"
          />
        
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
        //    disabled={disabled}
          >
            Login
          </Button>
          <Grid container sx={{ justifyContent : 'center', alignItems : 'center'}}>
            
            <Grid item> 
              <Link href="/register" variant="body2" sx={{ mr: 2 }}>
                {"Don't have an account? Sign Up"}
              </Link>
              
            </Grid>
            <Grid item> 
              <Link href="/forgetPassword" variant="body2">
                {"Forget Password"}
              </Link>
              
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  
    </div>
   
  );
 
}

