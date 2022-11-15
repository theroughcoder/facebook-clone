// import logo from './logo.svg';
import "./App.css";
import Home from "./screen/Home";
import { Routes, Route } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Login from "./screen/Login";
import Activate from "./screen/Activate";
import Profile from "./screen/profile";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Reset from "./screen/Reset";
import { useState } from "react";
import CreatePostPopup from "../src/component/createPostPopup";
import { useSelector } from "react-redux";
// import { useContext, useEffect, useState } from "react";
// import { Button, NavDropdown } from "react-bootstrap";
// import axios from "axios";

function App() {
  const [visiblePostPopup, setVisiblePostPopup] = useState(false);
  const{user} = useSelector((state) => state)
  return (
    <main>
      {visiblePostPopup &&  <CreatePostPopup user={user} setVisiblePostPopup={setVisiblePostPopup} />}
      <Container className="mt-4">
        <Routes>
          <Route element={<LoggedInRoutes/>}>

          <Route path="/" element={<Home visiblePostPopup={visiblePostPopup} setVisiblePostPopup={setVisiblePostPopup} />} />;
          <Route path="/activate/:token" element={<Activate/>} />;
          <Route path="/profile" element={<Profile/>} />;
          <Route path="/profile/:username" element={<Profile/>} />;
          

          </Route>
          <Route element={<NotLoggedInRoutes/>}>

          <Route path="/login" element={<Login />} />;
          </Route>
          <Route path="/reset" element={<Reset/>}/>
        </Routes>
      </Container>
    </main>
  ); 
}

export default App;
