import { Form, Formik } from "formik";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginInput from "../../component/inputs/LoginInput";
import * as Yup from "yup";
import axios from "axios";
import ResetInput from "./ResetInput";
export default function ChangePassword({
  password,
  setPassword,
  error,
  loading,
  setLoading,
  userInfos,
  setError,
}) {
  const navigate = useNavigate();
  const validatePassword = Yup.object({
    password: Yup.string()
      .required(
        "Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &)."
      )
      .min(6, "Password must be atleast 6 characters.")
      .max(36, "Password can't be more than 36 characters"),

    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });
  const { email } = userInfos;
  const changePassword = async (values) => {
    try {
      setLoading(true);
      await axios.post(`api/users/changePassword`, {
        email,
        password: values.password,
      });
      setError("");
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form" style={{ height: "310px" }}>
      <div className="reset_form_header">Change Password</div>
      <div className="reset_form_text">Pick a strong password</div>
      <Formik
     
        enableReinitialize
        initialValues={{
          password: "",
          conf_password: "",
        }}
        validationSchema={validatePassword}
        onSubmit={values => {
          changePassword(values)
        }}
      >
        {(formik) => (
          <Form>
            <ResetInput
              type="password"
              name="password"
              placeholder="New password"
              position= "up"
            />
            <ResetInput
              type="password"
              name="conf_password"
              placeholder="Confirm new password"
              bottom
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
