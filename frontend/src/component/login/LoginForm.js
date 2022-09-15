import React from 'react'
import { Formik, Form, } from "formik";
import { Link } from "react-router-dom";
import LoginInput from "../inputs/LoginInput";
import * as Yup from "yup";


export default function LoginForm() {

    const loginValidation = Yup.object({
        email: Yup.string()
          .required("Email address is required")
          .email("This is not a valid email address")
          .max(100),
        password: Yup.string().required("Password is required"),
      });
  return (
    <div className="login_wrap">
          <div className="login_1">
            <div className="logo">
              <span>facebookClone</span>
            </div>
            <p>
              Facebook helps you connect and share with the people in your life.
            </p>
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
                  onSubmit={values =>{
                    console.log(values)
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
              <Link className="forgot_password" to="/forgot">
                Forgotten password ?
              </Link>
              <div className="sign_splitter"></div>
              <button className="blue_btn open_signup">Create Account</button>
            </div>
            <Link className="sign_extra" to="/">
              <b>Create a Page </b> for a celebrity, barnd or business.
            </Link>
          </div>
        </div>
  )
}
