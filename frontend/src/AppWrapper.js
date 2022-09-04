import './index.css';
import App from './app';
import Room from './room'
import Create from './create'
import reportWebVitals from './reportWebVitals';
import {  BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export default function AppWrapper() {


    return (
    <Router >
        <Routes >
          <Route exact path="/" element={<App history={history}/>}/>
          <Route exact path="/create" element={<Create history={history}/>}/>
          <Route exact path="/room/:roomName" element={<Room/>}/>
        </Routes >

    </Router>
    )
  }

