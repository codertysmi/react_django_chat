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
import { responsiveFontSizes } from '@mui/material';
import Cookies from 'js-cookie'


export default function Create(props) {

  const [rooms, setRooms] = useState([])
  const [name, setName] = useState('')

  const changeText = (t) => setName(t.target.value.replace(/\s/g, "")  );

  const csrftoken = Cookies.get('csrftoken')

  var createRoom = () => {
    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json",
        "X-CSRFToken": csrftoken},  
        body: JSON.stringify({
            name: name
        }),
        };
            fetch('/api/create', requestOptions)
            .then((response) => {
              if (response.ok){
                props.history.replace({ pathname: `/room/${name}`})
              }
            })
        }
  return(
    <div>
      <Box m={10}>
      <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={9}>
        <Grid item xs={12} sx={{textAlign: "center"}}>
          <Typography variant="h1" sx={{fontWeight: "900", fontSize: "80px", color: "#242424"}}>
            Create
          </Typography>
          
        </Grid>
        <Grid item xs={12} sx={{alignContent: "center", flex: "center", justifyContent: "center", flexDirection: "row", display: "flex"}}>
          <div style={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "18px", backgroundColor: "white", width: "500px", display: 'flex', alignItems: 'center'}}>
          <InputBase value={name} onChange={changeText} placeholder="Room name" sx={{p: '6px 18px', width: "100%"}}/>
          </div>

        </Grid>
      
        <Grid item xs={12} sx={{flex: "center", justifyContent: "center", display: "flex"}}>
            <Button onClick={createRoom} variant="contained" color="primary" sx={{borderRadius: "24px"}} size="large" disableElevation>
                Create
            </Button>
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

