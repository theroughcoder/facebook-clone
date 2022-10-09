import { Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import ResetInput from "../../component/reset/ResetInput";
import * as Yup from "yup";
import axios from "axios";
export default function SearchAccount({
  setEmail,
  error,
  setError,
  setLoading,
  setUserInfos,
  setVisible,
}) {
  const validateEmail = Yup.object({
    email: Yup.string()
      .required("Email address ir required.")
      .email("Must be a valid email address.")
      .max(50, "Email address can't be more than 50 characters."),
  });
  const handleSearch = async (value) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `api/users/findUser`,
        { email: value.email }
      );
      setEmail(value.email)
      setUserInfos(data);
      setVisible(1);
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form">
      <div className="reset_form_header">Find Your Account</div>
      <div className="reset_form_text">
        Please enter your email address or mobile number to search for your
        account.
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          email: "",
        }}
        validationSchema={validateEmail}
        onSubmit={values => {
          handleSearch(values)
        }}
      >
        {(formik) => (
          <Form>
            <ResetInput
              type="text"
              name="email"
              placeholder="Email address or phone number"
              
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
