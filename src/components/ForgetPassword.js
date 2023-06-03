// import './Login.css'
import { Alert, Snackbar, Slide } from "@mui/material";
import emaill from './email.png'
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

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [code, setCode] = useState();
    const [codeError, setCodeError] = useState(false)
    const [password, setPassword] =useState('');
    const [passwordError, setPasswordError] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const [issent, setIsSent] = useState(true)
    const [isverify, setIsVerify] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('Defaalut Value');
    const [severity, setSeverity] = useState('success');

    var sectionStyle = {
      minHeight: '100vh',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${emaill})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'   
     
   };
    
    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };
  
    const navigate = useNavigate()
  
    useEffect(() =>{
      console.log("Redendering")
    },[])
  
    const NewPassword = (event) => {
        event.preventDefault();

        if(password == '')
        {
          setPasswordError(true);
          return;
        }

        if(passwordError)
          {
            return
          }
         const data = {
          email : email,
          password : password
         }
        
          try {
            axios.post('https://localhost:44392/api/Auth/newPassword', data)
            .then(res => {
              alert("Your password has been set successfully")
             navigate('/login');
            });
            
           
          } catch (error) {
            console.error(error);
          }
         
         };
         const SendCode = (event) => {
          event.preventDefault();
          if(code == '')
          {
            setCodeError(true);
            return;
          }
          if(codeError)
          {
            return
          }
         const data = {
          email : email,
          code : code
         }
        

            axios.post('https://localhost:44392/api/Auth/matchCode', data)
            .then(res => {
              setIsVerify(false)
              setIsConfirm(true)
            })
            .catch(() =>{
              setMessage('Your code is not matching, please enter the correct code')
              setSeverity('error')
              setAlertOpen(true)
            })
           
         
         
         };

         const SendEmail = (event) => {
          
          event.preventDefault();
          if(email == '')
          {
            setEmailError(true);
            return;
          }

          if(emailError)
          {
            return
          }
         const data = {
          email : email
         }
        
            axios.post('https://localhost:44392/api/Auth/verifyEmail', data)
            .then(res => {
              setIsSent(false)
              setIsVerify(true)
            })
            .catch(() =>{
              setMessage('Your Account has not been registered on this Email')
              setSeverity('error')
              setAlertOpen(true)
            })
           
          
         
         };
  
    return (
    <div style={sectionStyle}>
      <Snackbar TransitionProps={{ direction: 'left' }} TransitionComponent={Slide} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={2500} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
   {message}
  </Alert>
</Snackbar>
    <Container component="main" maxWidth="sm" sx={{display : 'flex', justifyContent: 'center'}}>
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
          //  marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // backgroundColor : 'white'
            backgroundColor : '#F4F4F4'
          }}
        >
        <Typography component="h1" variant="h3" sx={{mb : '5%'}}>
          Password Reset
        </Typography>

        {issent && 
            <>
          <Typography component="h1" variant="h5">
            Enter your Email
          </Typography>
          
          <Box component="form" onSubmit={e => SendEmail(e)} noValidate sx={{ mt: 1 }}>
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
           
          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
          //    disabled={disabled}
            >
              Send
            </Button>
            
          </Box>
          </>
 } 
   { isverify &&     <>
         <Typography component="p" variant="subtitle1">
              We have sent an email with a reset password link to your email
              address.
            </Typography>
            <Box component="form" onSubmit={e => SendCode(e)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Verification Code"
              value={code}
              placeholder='__  __  __  __  __  __'
              type='number'
              name="code"
              error={codeError}
            //   inputProps={
            //     {maxLength: 1}
            // }
              helperText={codeError && 'Please Enter 6 digit Verification Code'}
              onBlur={(e) => {
                const codeValue = e.target.value;
                
                if (codeValue.length !== 6) {
                  
                  setCodeError(true);
                 
                } else {
                  setCodeError(false);
                 
                }
              }}
              
              onChange={(e) => {
                const value = e.target.value;
               
                  setCode(value);
               
              }}
          //    autoComplete="email"
           //  autoFocus
            />
           
          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
          //    disabled={disabled}
            >
              Verify
            </Button>
            
          </Box>
        </>
        
    
}
    {isConfirm &&  <>
         <Typography component="p" variant="subtitle1">
              Please Enter your new Password
            </Typography>
            <Box component="form" onSubmit={e => NewPassword(e)} noValidate sx={{ mt: 1 }}>
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
              Verify
            </Button>
            
          </Box>
        </>
}
          <Grid container sx={{ justifyContent : 'center', alignItems : 'center'}}>
              
              <Grid item> 
                <Link href="/register" variant="body2" sx={{ mr: 2 }}>
                  {"Don't have an account? Sign Up"}
                </Link>
                
              </Grid>
              <Grid item> 
                <Link href="/login" variant="body2">
                  {"Login"}
                </Link>
                
              </Grid>
            </Grid>
        </Box>
      </Container>
      </div>
    
    );
}

