// import { useEffect, useReducer, useState } from "react";
// import axios from "axios";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

import { useSelector } from "react-redux";
import Header from "../component/header/Header";
import LeftHome from "../component/home/left";
import RightHome from "../component/home/right";
import  "../style/Home.css"

function HomeScreen() {
const{user} = useSelector((state) => state)
  return (
    <>
      <Header />
      <LeftHome user={user}/>
      <RightHome user={user}/>
    </>
  );
}

export default HomeScreen;
