import React from "react";
import { ErrorMessage, useField } from "formik";

export default function LoginInput({ placeholder, bottom, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="input_wrap">
      {meta.touched && meta.error && !bottom && <div style={{ top: "-40px" }} className="input_error">
        <div>
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
        </div>
        <div className="error_arrow_top"></div>
        
      </div>
      }

      <input
        className={meta.touched && meta.error ? "input_error_border" : ""}
        type={field.type}
        name={field.name}
        placeholder={placeholder}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && bottom && <div style={{ bottom: "-45px" }} className="input_error">
        <div>
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
        </div>
        <div className="error_arrow_bottom"></div>
      </div>}


      {meta.touched && meta.error && <i className="error_icon" />}
    </div>
  );
}
