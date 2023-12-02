import React from 'react'
import { Formik, Form, } from "formik";
import { Link } from "react-router-dom";
import LoginInput from "../inputs/loginInput";
import * as Yup from "yup";
import axios from "axios";
import { useReducer, useState } from 'react';
import { getError } from '../../utils';
import { useDispatch } from 'react-redux';
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import BeatLoader from 'react-spinners/BeatLoader';


export default function LoginForm({ setVisible }) {
  const navigate = useNavigate();
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("This is not a valid email address")
      .max(100),
    password: Yup.string().required("Password is required"),
  });
  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true, user: {}, error: "" };
      case "FETCH_SUCCESS":
        return { ...state, user: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [{ loading, error, user }, dispatchLoc] = useReducer(reducer, {
    user: {},
    loading: false,
    error: "",
  });

  const dispatch = useDispatch()
  const loginSubmit = async (values) => {
    dispatchLoc({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        {
          email: values.email,
          password: values.password,
        });

      dispatchLoc({ type: "FETCH_SUCCESS", payload: data });

      dispatch({ type: "USER_LOGIN", payload: data })
      Cookies.set("user", JSON.stringify(data));
      navigate("/");



    } catch (error) {

      dispatchLoc({ type: "FETCH_FAIL", payload: getError(error) });

    }
  }
  return (
    <div className="login_wrap">
      <div className="login_1">
        <div className="logo">
          <span>facebookClone</span>
        </div>
        <p>
          Facebook helps you connect and share with the people in your life.
        </p>
          <h5>
          Email: (sanchit2000sp1@gmail.com)
        </h5>
      <h6>
          Password: (sanchit)
        </h6>
      </div>

      <div className="login_2">
        <div className="login_2_wrap">
          <div className="login_form">
            <Formik
              enableReinitialize
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginValidation}
              onSubmit={values => {
                loginSubmit(values)
              }}
            >
              {(formik) => (
                <Form>
                  <LoginInput
                    placeholder="Email address"
                    type="text"
                    name="email"
                  />
                  <LoginInput
                    placeholder="Password"
                    type="password"
                    name="password"
                  />
                  <button className="blue_btn" type="submit">
                    Log In
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          <BeatLoader
            color="#36d64b"
            loading={loading}
            margin={4}
            size={15}
          />
          {error && <div className='error_text'>{error}</div>}
          <Link className="forgot_password" to="/reset">
            Forgotten password ?
          </Link>
          <div className="sign_splitter"></div>
          <button onClick={() => { setVisible(true) }} className="blue_btn open_signup">Create Account</button>
        </div>
        <Link className="sign_extra" to="/">
          <b>Create a Page </b> for a celebrity, brand or business.
        </Link>
      </div>
    </div>
  )
}
