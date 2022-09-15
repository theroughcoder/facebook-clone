import { Form, Formik } from 'formik'
import React from 'react';
import * as Yup from "yup";
import RegisterInput from '../inputs/RegisterInput';


export default function RegisterForm() {
    const loginValidation = Yup.object({
        email: Yup.string()
            .required("Email address is required")
            .email("This is not a valid email address")
            .max(100),
        password: Yup.string().required("Password is required"),
    });
    return (
        <div>
            <div className='blur'></div>
            <div className='register'>
                <div className='register_header'>
                    <i className='exit_icon'></i>
                    <span>Sign Up</span>
                    <span>It's quick and easy</span>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        first_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        bYear: "",
                        bMonth: "",
                        bDay: "",
                        gender: ""
                    }}
                    validationSchema={loginValidation}
                    onSubmit={values => {
                        console.log(values)
                    }}
                >{(formik) => (

                    <Form className='register_form'>
                        <div className='reg_line'>
                            <RegisterInput
                                type="text"
                                placeholder="First name"
                                name="first_name"
                            />
                        </div>
                        <div className='reg_line'>
                            <RegisterInput
                                type="text"
                                placeholder="Last name"
                                name="last_name"
                            />
                        </div>
                        <div className='reg_line'>
                            <RegisterInput
                                type="text"
                                placeholder="Email address"
                                name="email"
                            />
                        </div>
                        <div className='reg_line'>
                            <RegisterInput
                                type="password"
                                placeholder="New password"
                                name="password"
                            />
                        </div>
                        <div className='reg_col'>
                            <div className='reg_line_header'>
                                Date of birth <i className='info_icon'></i>
                            </div>
                            <div className='reg_grid'>
                                <select name="bDay">
                                    <option>15</option>
                                </select>
                                <select name="bMonth">
                                    <option>15</option>
                                </select>
                                <select name="bYear">
                                    <option>15</option>
                                </select>
                            </div>
                            <div className='reg_line_header'>
                                Gender <i className='info_icon'></i>
                            </div>
                            <div className='reg_grid'>
                                <label htmlFor="male">
                                    Male
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value="male"
                                    />
                                </label>
                                <label htmlFor="female">
                                    Female
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        value="female"
                                    />
                                </label>
                                <label htmlFor="custom">
                                    Custom
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="custom"
                                        value="custom"
                                    />
                                </label>
                            </div>

                        </div>
                        <div className='reg_info'>
                        By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
                        </div>
                        <div className='reg_btn_wrapper'>
                            <button className='blue_btn open_signup'>Sign Up</button>
                        </div>


                    </Form>
                )}
                </Formik>
            </div>
        </div>
    )
}
