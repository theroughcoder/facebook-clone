// import { useEffect, useReducer, useState } from "react";
// import axios from "axios";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

import { useSelector } from "react-redux";
import CreatePost from "../component/CreatePost";
import Header from "../component/header/Header";
import LeftHome from "../component/home/left";
import RightHome from "../component/home/right";
import Stories from "../component/home/stories";
import  "../style/Home.css"

function HomeScreen() {
const{user} = useSelector((state) => state)
  return (
    <div className="home">
      <Header />
      <LeftHome user={user}/>
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user}/>
    </div>
  );
}

export default HomeScreen;
