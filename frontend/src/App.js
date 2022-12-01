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
import { useEffect, useReducer, useState } from "react";
import CreatePostPopup from "../src/component/createPostPopup";
import { useSelector } from "react-redux";
import Friends from "./screen/friends";
import axios from "axios";
import { postsReducer } from "./functions/reducers";
// import { useContext, useEffect, useState } from "react";
// import { Button, NavDropdown } from "react-bootstrap";
// import axios from "axios";

function App() {
  const [visible, setVisible] = useState(false);
  const [visiblePostPopup, setVisiblePostPopup] = useState(false);
  const{user} = useSelector((state) => state)
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  useEffect(() => {
    // getAllPosts();
  }, []);
  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllposts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error.response.data.message,
      });
    }
  };
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
          <Route path="/friends"element={<Friends setVisible={setVisible} getAllPosts={getAllPosts} />}/>;
          <Route path="/friends/:type"element={<Friends setVisible={setVisible} getAllPosts={getAllPosts} />}exact/>

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
