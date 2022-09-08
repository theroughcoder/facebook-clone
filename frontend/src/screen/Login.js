import React, { useState } from "react";
import "../style/Login.css";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import LoginInput from "../component/inputs/loginInput";
const loginInfo = {
    email: "",
    password: ""
}

function Login() {
    const[login, setLogin] = useState(loginInfo)
    const {email, password} = login;
    console.log(login)

    const loginHandler = (e) =>{
      const {name, value} = e.target;
      setLogin({...login, [name]: value}) 
    }
  return (
    <div className="login">
      <div className="login_wrapper">
        <div className="login_wrap">
          <div className="login_1">
                <div className="logo"><span >facebookClone</span></div>
            <span>
              Facebook helps you connect and share with the people in your life.
            </span>
          </div>

          <div className="login_2">
            <div className="login_2_wrap">
            <div className="login_form">
              <Formik
              enableReinitialize
               initialValues ={{
                 email,
                  password
                }}>
               
                {(formik) => (
                  <Form>
                    <LoginInput placeholder="Email address" type="text" name="email" onChange={loginHandler}/>
                    <LoginInput placeholder="Password" type="password" name="password" onChange={loginHandler}/>
                    <button className="blue_btn" type="submit">Log In</button>
                  </Form>
                )}
              </Formik>
            </div>
              <Link className="forgot_password" to="/forgot">Forgotten password ?</Link>
              <div className='sign_splitter'></div>
              <button className="blue_btn open_signup">Create Account</button>
            </div>
            <Link className="sign_extra" to="/">
              <b>Create a Page </b> for a celebrity, barnd or business.
            </Link>
          </div>
        </div>
      </div>
      <div className="register"> </div>
    </div>
  );
}

export default Login;
