import React from 'react'
import { ErrorMessage, useField } from "formik";

export default function RegisterInput({ placeholder, ...props }) {
    const [field, meta] = useField(props);
    
  return (
    <div className="input_wrap">
      <input
      // autocomplete="off"
        className={meta.touched && meta.error ? "input_error_border" : ""}
        // type={field.type}
        // name={field.name}
        placeholder={placeholder}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && <div  className="input_error">
        <div>
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
        </div>
      </div>}


      {meta.touched && meta.error && <i className="error_icon" />}
    </div>
  )
}
