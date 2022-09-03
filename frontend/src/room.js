import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Fade from '@mui/material/Fade';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Room(props){
    var loc = window.location.pathname;
    const roomName = loc.substring(6, )
    const [name, setName] = useState('test')
    const [text, setText] = useState('') 
    const [socketUrl, setSocketUrl] = useState(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
    const [messageHistory, setMessageHistory] = useState([]);
    const [users, setUsers] = useState(1);

    const { sendMessage, lastMessage, readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);
    var dataFromServer = {}
    useEffect(() => {
      
      if (lastJsonMessage !== null && lastJsonMessage.type == "chat_message") {

        setMessageHistory((prev) => prev.concat(lastJsonMessage));
      }
      else if (lastJsonMessage !== null && lastJsonMessage.type == "users_connected"){
        setUsers(lastJsonMessage.users)
      }
    }, [lastJsonMessage, setMessageHistory ]);
  
    const handleClickChangeSocketUrl = useCallback(
      () => setSocketUrl('wss://demos.kaazing.com/echo'),
      []
    );
  
    var handleClickSendMessage = () => {

      sendJsonMessage({ 'text': text})
      setText("")
    };
  
    const changeText = (t) => setText(t.target.value);
    const changeName = (t) => setName(t.target.value);
  
    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    return (
      <div>
        <Box m={10}>
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={9}>
            <Grid item xs={12} sx={{textAlign: "center"}}>
              <Typography variant="h1" sx={{fontWeight: "900", fontSize: "60px", color: "#242424"}}>
                #{capitalizeFirstLetter(roomName)}
              </Typography>
              <Typography variant="subtitle1" sx={{fontWeight: "500", fontSize: "22px", color: "#242424"}}>
                Active users: {users}
              </Typography>
            </Grid>

            <Grid item md={12} lg={12}>
              {messageHistory.length > 0 ?  (
                <div style={{height: "500px", overflow: "auto"}}>
                {messageHistory.map((message, idx) => (
                  <div style={{padding: "25px 20px 20px 25px"}}>
                  <Fade in={true}>
                      <div style={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "18px", backgroundColor: "white", minHeight: "100px", display: 'flex', flexDirection: "row", alignItems: "center"}} key={idx}>
                        <Box m={3} sx={{display: 'flex', alignItems: "center", height: "100%"}}>
                          <img src="https://clubsuizomadrid.org/assets/images/juntadirectiva/user-gray.png" style={{width: "80px", height: "80px", p: '6px 18px',}}>
                          </img>
                        <div style={{display: "flex", flexDirection: "column"}}>
                          <Typography variant="h6" sx={{p: '6px 18px', fontWeight: "800", fontSize: "18px"}}>
                            {message.name}
                          </Typography>
                          <Typography variant="subtitle1"  sx={{p: '6px 18px'}}>
                            {message ? message.text : null}
                          </Typography>
                        </div>
                        </Box>
                      </div>
                  </Fade>
                  </div>
                  ))}
                </div>
                ) : 
                <Grid item xs={12} sx={{textAlign: "center"}}>
                <Typography variant="subtitle2" sx={{fontSize: "15px", color: "#242424", opacity: .5}}>
                Messages can only be viewed by people who were in the room when they were sent. 
                </Typography>
              </Grid>
                }
            </Grid>
            


            <Grid item xs={12} sx={{alignContent: "center", flex: "center", justifyContent: "center", flexDirection: "row", display: "flex"}}>
              <div style={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", borderRadius: "18px", backgroundColor: "white", width: "500px", display: 'flex', alignItems: 'center'}}>
                <InputBase value={text} onChange={changeText} placeholder="Write a message" sx={{p: '6px 18px', width: "100%"}}/>
                <IconButton onClick={handleClickSendMessage}disabled={readyState !== ReadyState.OPEN} size="large" type="button" sx={{ p: '10px', borderRadius: "18px" }} aria-label="search">
                  <SendIcon />
                </IconButton>
              </div>

          </Grid>

            </Grid>
        </Box>
      </div>
    );
  };


