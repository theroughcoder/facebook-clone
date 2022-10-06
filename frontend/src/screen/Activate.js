import { useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../component/CreatePost";

import ActivateForm from "../component/ActivateForm";
import "../style/Activate.css"
import axios from "axios";
import Cookies from "js-cookie";
import LeftHome from "../component/home/left";
import Stories from "../component/home/stories";
import RightHome from "../component/home/right";
import Header from "../component/header/Header";
import { getError } from "../utils";
export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((user) => ({ ...user }));

  const { token } = useParams();
console.log(token)
  const reducer = (state, action) => {
    switch (action.type) {
      case "ACTIVATE_REQUEST":
        return { ...state, loading: true, error: "" };
      case "ACTIVATE_SUCCESS":
        return { ...state, result: action.payload, loading: true };
      case "ACTIVATE_FAIL":
        return { ...state, loading: true, error: action.payload };
      default:
        return state;
    }
  };

  const [{ loading, error, result }, dispatchLoc] = useReducer(reducer, {
    result: "",
    loading: false,
    error: "",
  });
  useEffect(() => {
    activateAccount(); 
  }, []);
  const activateAccount = async () => {
    try {
      dispatchLoc({type: "ACTIVATE_REQUEST"}) 
      const { data } = await axios.post(
        '/api/users/activate',
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        );
        dispatchLoc({type: "ACTIVATE_SUCCESS", payload: data.message})
      Cookies.set("user", JSON.stringify({ ...user, verified: true }));
      dispatch({
        type: "USER_VERIFY",
        payload: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      dispatchLoc({ type: "ACTIVATE_FAIL", payload: getError(error) });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };
  return (
    <div className="home">
      {result && (
        <ActivateForm
          type="success"
          header="Account verification succeeded."
          text={result}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
}
