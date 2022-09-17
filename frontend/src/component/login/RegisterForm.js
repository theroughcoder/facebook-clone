import { Field, Form, Formik } from 'formik'
import { useState } from 'react';
import * as Yup from "yup";
import RegisterInput from '../inputs/RegisterInput';


export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

    const loginValidation = Yup.object({
        first_name: Yup.string()
            .required("First name is required")
            .min(2, "Must contain atleast 2 characters.")
            .max(16, "Must contain atmost 16 characters. ")
            .matches(/^[aA-zZ]+$/, "Numbers and special characters are not allowed."),
        last_name: Yup.string()
            .required("Last name is required")
            .min(2, "Must contain atleast 2 characters.")
            .max(16, "Must contain atmost 16 characters. ")
            .matches(/^[aA-zZ]+$/, "Numbers and special characters are not allowed."),
        email: Yup.string()
            .required("Email address is required")
            .email("This is not a valid email address")
            .max(100),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password should contain atleast 6 characters.")
            .max(20, "Password should contain atmost 20 characters."),
    });

    const years = Array.from(new Array(108), (val, index) => new Date().getFullYear() - index)
    const months = Array.from(new Array(12), (val, index) => 1 + index);


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

                    initialValues={{
                        first_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        bYear: new Date().getFullYear(),
                        bMonth: "1",
                        bDay: "1",
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
                                <Field as="select" name="bDay" >
                                    {Array.from(new Array(new Date(formik.values.bYear, formik.values.bMonth, 0).getDate()), (val, index) => 1 + index).map((day, index) => <option key={index} value={day} >{day}</option>)}
                                </Field>
                                <Field as="select" name="bMonth" >
                                    {months.map((month, index) => <option key={index} value={month} >{month}</option>)}
                                </Field>
                                <Field as="select" name="bYear" >
                                    {years.map((year, index) => <option key={index} value={year} >{year}</option>)}
                                </Field>
                            </div>
                            <div className='reg_line_header'>
                                Gender <i className='info_icon'></i>
                            </div>
                            <div className='reg_grid'>
                                <label id="male">
                                    <Field
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value="male"
                                    />
                                    Male
                                </label>
                                <label id="female">
                                    <Field
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        value="female"
                                    />
                                    Female
                                </label>
                                <label id="custom">
                                    <Field
                                        type="radio"
                                        name="gender"
                                        id="custom"
                                        value="custom"
                                    />
                                    Custom
                                </label>
                            </div>

                        </div>
                        <div className='reg_info'>
                            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
                        </div>
                        <div className='reg_btn_wrapper'>
                            <button type='submit' className='blue_btn open_signup'>Sign Up</button>
                        </div>


                    </Form>
                )}
                </Formik>
            </div>
        </div>
    )
}
