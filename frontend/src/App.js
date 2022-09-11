// import logo from './logo.svg';
import "./App.css";
import Home from "./screen/Home";
import { Routes, Route } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Login from "./screen/Login";

// import { useContext, useEffect, useState } from "react";
// import { Button, NavDropdown } from "react-bootstrap";
// import axios from "axios";

function App() {
  return (
    <main>
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />;
          <Route path="/login" element={<Login />} />;
        </Routes>
      </Container>
    </main>
  ); 
}

export default App;
