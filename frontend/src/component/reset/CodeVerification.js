import { Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import ResetInput from "./ResetInput";
export default function CodeVerification({
  setCode,
  error,
  loading,
  setLoading,
  setVisible,
  setError,
  userInfos,
}) {
  const validateCode = Yup.object({
    code: Yup.string()
      .required("Code is required")
      .min("5", "Code must be 5 characters.")
      .max("5", "Code must be 5 characters."),
  });
  const { email } = userInfos;
  const verifyCode = async (values) => {
    try {
      setLoading(true);
      await axios.post(
        `api/users/validateResetCode`,
        { email, code: values.code }
      );
      setCode(values.code)
      setVisible(3);
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  console.log(email);
  return (
    <div className="reset_form">
      <div className="reset_form_header">Code verification</div>
      <div className="reset_form_text">
        Please enter code that been sent to your email.
      </div>
      <Formik
       
        enableReinitialize
        initialValues={{
          code: "",
        }}
        validationSchema={validateCode}
        onSubmit={values => {
          verifyCode(values)
        }}
      >
        {(formik) => (
          <Form >
            <ResetInput
              type="text"
              name="code"
              placeholder="Code"
              width="200"
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
