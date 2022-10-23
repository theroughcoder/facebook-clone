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
import SendVerification from "../component/home/sendVerification";
import Post from "../component/post";
import  "../style/Home.css"
import { useEffect, useReducer, useState } from "react";
import axios from "axios";


  function reducer(state, action) {
    switch (action.type) {
      case "POSTS_REQUEST":
        return { ...state, loading: true, error: "" };
      case "POSTS_SUCCESS":
        return {
          ...state,
          loading: false,
          posts: action.payload,
          error: "",
        };
      case "POSTS_ERROR":
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  }

function HomeScreen({visiblePostPopup, setVisiblePostPopup}) {
  const [visible, setVisible] = useState(false);

  const [{ loading, error, posts }, dispatch] = useReducer(reducer, {
    loading: false,
    posts: [],
    error: "",
  });
  useEffect(() => {
    getAllPosts();
  }, [visiblePostPopup]);
  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `/api/posts/${user.id}`,
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
  const{user} = useSelector((state) => state)
  
  return (
    <div className="home">
      <Header />
      <LeftHome user={user}/>
      <div className="home_middle">
        <Stories />
        {user.verified === false && <SendVerification user={user} />}
       
        
        <CreatePost user={user} setVisiblePostPopup={setVisiblePostPopup}/>
        <div className="posts">
          {posts.map((post) => (
            <Post key={post._id} post={post} user={user} />
          ))}
        </div>
      </div>
      <RightHome user={user}/>
    </div>
  );
}

export default HomeScreen;
