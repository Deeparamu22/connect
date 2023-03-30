import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import io from 'socket.io-client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    </BrowserRouter>
);
const socket=io("ws://172.17.56.144:3001/");
socket.emit("hello everyone");
socket.on("hello everyone",(...args)=>{
    console.log("hello everyone",...args);
})
