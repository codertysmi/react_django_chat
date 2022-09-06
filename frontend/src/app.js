import logo from './logo.svg';
import './App.css';
import axios from "axios";
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {
  Link,
  
} from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // version 5.2.0
import Cookies from 'js-cookie'
import { formControlClasses } from '@mui/material';


export default function App(props) {
  let history = useNavigate ();
  var t = 2
  const [rooms, setRooms] = useState([])
  const csrftoken = Cookies.get('csrftoken')

  useEffect(()=>{


    const requestOptions = {
      method: 'GET',
      headers: { "Content-Type": "application/json",
      "X-CSRFToken": csrftoken},  
      };
          fetch('http://46.101.179.61:8080/api/')
          .then((response) => {
            if (response.ok){
              response.json().then(data=>setRooms(data.rooms))

            }
          })
  }, []) 
  return(
    <div>
      <Box m={10}>

      <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={9}>
        <Grid item xs={12} sx={{textAlign: "center"}}>
          <Typography variant="h1" sx={{fontWeight: "900", fontSize: "80px", color: "#242424"}}>
            Chat App
          </Typography>

        </Grid>
        <Grid item xs={12} sx={{alignContent: "center", flex: "center", justifyContent: "center", flexDirection: "row", display: "flex"}}>
          <div style={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "18px", backgroundColor: "white", width: "500px", display: 'flex', alignItems: 'center'}}>
          <InputBase placeholder="Search chat room" sx={{p: '6px 18px', width: "100%"}}/>
          <IconButton size="large" type="button" sx={{ p: '10px', borderRadius: "18px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          </div>

        </Grid>
        {rooms.map((room)=>(
          <Grid item xs={12} md={3} lg={3} sx={{alignContent: "center", flex: "center", justifyContent: "center", flexDirection: "row", display: "flex"}}>
              <div style={{backgroundColor: "white",  textAlign: "center", boxShadow: " rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "24px", minHeight: "275px", width: "400px"}} >
          
              <div style={{padding: "25px"}}>
                <Typography noWrap variant="h5" sx={{fontWeight: "800", fontSize: "40px", color: "#3D3C3C", padding: "25px"}}>
                  #{room.name}
                </Typography>
                <Typography variant="subtitle" sx={{ fontSize: "25px", color: "#3D3C3C"}}>
                  {room.users} Users
                </Typography>
              </div>
              <Button onClick={history(`/room/${room.name}`)} variant="contained" sx={{borderRadius: "24px"}} size="large" disableElevation>
                Join
              </Button>
              </div>
          </Grid>

        ))}
      
        <Grid item xs={12}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sx={{textAlign: "center"}}>
              <Typography variant="subtitle2" sx={{fontSize: "20px", color: "#242424", opacity: .8}}>
                Didn't find any chat room that you want? Create your own here.
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{flex: "center", justifyContent: "center", display: "flex"}}>
                  <Button onClick={()=>history('/create') }variant="contained" color="primary" sx={{borderRadius: "24px"}} size="large" disableElevation>
                  Create
                  </Button>

            </Grid>
          </Grid>
        </Grid>
      
        <Grid item xs={12} sx={{textAlign: "center"}}>
          <Typography variant="subtitle2" sx={{fontSize: "15px", color: "#242424", opacity: .5}}>
            Created by Coderty using Django and React.JS
          </Typography>
        </Grid>
      </Grid>

      </Box>
    </div>
  );


};

