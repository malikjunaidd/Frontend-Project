import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor : '#3F695F',
        fontSize : '1.5em',
        // backgroundColor: (theme) =>
        //   theme.palette.mode === "light"
        //     ? theme.palette.grey[200]
        //     : theme.palette.grey[800],
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              Automobile Spares Hub is an  amazing spare parts provider worldwide. We are here from many ages and provides quality 
              auto parts. We are providing products of all the famous brands and having alot of satisfied customers.
              We provide quality ,security and effeciency.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6"  gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" >
              123 Main Street, 6 Road, Pakistan
            </Typography>
            <Typography variant="body2" >
              Email: autohub@example.com
            </Typography>
            <Typography variant="body2" >
              Phone: +1 234 567 8901
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6"  gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://www.facebook.com/" color="inherit">
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/"
              color="inherit"
              sx={{ pl: 1, pr: 1 }}
            >
              <Instagram />
            </Link>
            <Link href="https://www.twitter.com/" color="inherit">
              <Twitter />
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            {"Copyright © "}
            <Link color='inherit' sx={{textDecoration : 'none'}} href="https://your-website.com/">
              Automobile Spares Hub 
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}