import React from "react";
import ReactDOM from "react-dom";
//import { Route } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
// import RentBoard from "./RentBoard.jsx";
import "./Login.css";

import { CrossStorageHub } from 'cross-storage'

// CrossStorageHub.init([
//   {origin: /domain1.netlify.com/, allow: ['get', 'set']},
//   {origin: /domain2.netlify.com/, allow: ['get']},
//   {origin: /127.0.0.1/, allow: ['get', 'set']},
//   {origin: /localhost/, allow: ['get', 'set']}
// ]);

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/rent" element={<RentBoard />} /> */}
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
