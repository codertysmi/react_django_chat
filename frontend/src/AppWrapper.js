import './index.css';
import App from './app';
import Room from './room'
import Create from './create'
import reportWebVitals from './reportWebVitals';
import {  Router, Switch, Route, useParams } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export default function AppWrapper() {


    return (
    <Router history={history}>
        <Switch>
          <Route exact path="/" render={()=><App history={history}/>}/>
          <Route exact path="/create" render={()=><Create history={history}/>}/>
          <Route exact path="/room/:roomName" render={()=><Room/>}/>
        </Switch>

    </Router>
    )
  }

