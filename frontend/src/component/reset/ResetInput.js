import React from "react";
import { ErrorMessage, useField } from "formik";

export default function ResetInput({ placeholder, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="reset_input_wrap" style={{width: `${props.width}px`}}>
     
      {meta.touched && meta.error && props.position && <div  className="reset_error_display_up ">
      <div className="reset_error_arrow_top"></div>
        <div>
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
        </div>
      </div>}
      <input
      autoComplete="off"
        className={meta.touched && meta.error ? "reset_input_error_border" : ""}
        type={field.type}
        name={field.name}
        placeholder={placeholder}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && !props.position && <div  className="reset_error_display ">
      <div className="reset_error_arrow_bottom"></div>
        <div>
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
        </div>
      </div>}


      {meta.touched && meta.error && <i className="error_icon" />}
    </div>
  );
}
