import { Field, Form, Formik } from 'formik'
import BeatLoader from "react-spinners/BeatLoader";
import * as Yup from "yup";
import RegisterInput from '../inputs/RegisterInput';
import axios from "axios";
import { useReducer, useState } from 'react';
import { getError } from '../../utils';
import { useDispatch } from 'react-redux';
import Cookies from "js-cookie"
import {useNavigate} from "react-router-dom"

export default function RegisterForm({setVisible}) {
    
    const navigate = useNavigate();
    const [dobError, setdobError] = useState("");
    const [genderError, setGenderError] = useState("")

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
            .max(40, "Password should contain atmost 40 characters."),
    });

    const years = Array.from(new Array(108), (val, index) => new Date().getFullYear() - index)
    const months = Array.from(new Array(12), (val, index) => 1 + index);

    const reducer = (state, action) => {
        switch (action.type) {
            case "FETCH_REQUEST":
                return { ...state, loading: true, user: {}, error: "" };
            case "FETCH_SUCCESS":
                return { ...state, user: action.payload, loading: false };
            case "FETCH_FAIL":
                return { ...state, loading: false, error: action.payload };
            default:
                return state;
        }
    };

    const [{ loading, error, user }, dispatchLoc] = useReducer(reducer, {
        user: {},
        loading: false,
        error: "",
    });
    const dispatch = useDispatch()
    const registerSubmit = async (values) => {
        dispatchLoc({ type: "FETCH_REQUEST" });
        try {
            const { data } = await axios.post("/api/users/register",
                {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    password: values.password,
                    bYear: values.bYear,
                    bMonth: values.bMonth,
                    bDay: values.bDay,
                    gender: values.gender,
                });

            dispatchLoc({ type: "FETCH_SUCCESS", payload: data });
            const {message, ...rest} = data;
                setTimeout(()=>{
                    dispatch({type: "USER_LOGIN", payload: rest})
                    Cookies.set("user", JSON.stringify(rest));
                    navigate("/");
                }, 2000);


        } catch (error) {
        
            dispatchLoc({ type: "FETCH_FAIL", payload: getError(error) });

        }
    }
    return (
        <div>
            <div className='blur'></div>
            <div className='register'>
                <div className='register_header'>
                    <i onClick={()=>{setVisible(false)}} className='exit_icon'></i>
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
                        const current_date = new Date();
                        const picked_date = new Date(values.bYear, values.bMonth - 1, values.bDay);
                        const atleast14 = new Date(1970 + 14, 0, 1);
                        const notMoreThan70 = new Date(1970 + 70, 0, 1);
                        if (current_date - picked_date < atleast14) {
                            setdobError("It looks like you have entered the wrong info. Please make sure that your age should be less then 14 years")
                        } else if (current_date - picked_date > notMoreThan70) {
                            setdobError("It looks like you have entered the wrong info. Please make sure that your age should not exceed 70")

                        } else if (!values.gender) {
                            setGenderError("Specify your gender before submitting the form.")
                        }
                        else {
                            registerSubmit(values)
                        }
                    }}
                >{(formik) => {

                    if (formik.values.bDay > new Date(formik.values.bYear, formik.values.bMonth, 0).getDate()) {
                        formik.values.bDay = "1";
                    }
                    return (

                        <Form className='register_form' >


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
                                <div className='reg_col_wrapper'>

                                    <div className='reg_line_header'>
                                        Date of birth <i className='info_icon'></i>
                                    </div>
                                    <div className='reg_grid'  >
                                        {dobError && <>
                                            <div className='display_error_top error_display'>{dobError}</div>
                                            <div className="error_arrow_top"></div>
                                        </>
                                        }
                                        <Field onClick={() => { setdobError("") }} as="select" name="bDay">
                                            {Array.from(new Array(new Date(formik.values.bYear, formik.values.bMonth, 0).getDate()), (val, index) => 1 + index).map((day, index) => <option key={index} value={day} >{day}</option>)}
                                        </Field>
                                        <Field onClick={() => { setdobError("") }} as="select" name="bMonth" >
                                            {months.map((month, index) => <option key={index} value={month} >{month}</option>)}
                                        </Field>
                                        <Field onClick={() => { setdobError("") }} as="select" name="bYear" >
                                            {years.map((year, index) => <option key={index} value={year} >{year}</option>)}
                                        </Field>
                                    </div>
                                    <div className='reg_line_header'>
                                        Gender <i className='info_icon'></i>
                                    </div>
                                    <div className='reg_grid'>
                                        <label id="male">
                                            <Field
                                                onClick={() => { setGenderError("") }}
                                                type="radio"
                                                name="gender"
                                                id="male"
                                                value="male"

                                            />
                                            Male
                                        </label>
                                        <label id="female">
                                            <Field
                                                onClick={() => { setGenderError("") }}
                                                type="radio"
                                                name="gender"
                                                id="female"
                                                value="female"
                                            />
                                            Female
                                        </label>
                                        <label id="custom">
                                            <Field
                                                onClick={() => { setGenderError("") }}
                                                type="radio"
                                                name="gender"
                                                id="custom"
                                                value="custom"
                                            />
                                            Custom
                                        </label>
                                        {genderError && <>
                                            <div className='display_error_bottom error_display'>{genderError}</div>
                                            <div className="error_arrow_bottom"></div>
                                        </>
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className='reg_info'>
                                By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
                            </div>
                            <div className='reg_btn_wrapper'>
                                <button type='submit' className='blue_btn open_signup'>Sign Up</button>
                            </div>
                            <div className='loading'>

                                <BeatLoader
                                    color="#36d64b"
                                    loading={loading}
                                    margin={4}
                                    size={15}
                                />
                                {error && <div className='error_text'>{error}</div>}
                                {user.message && <div className='success_text'>{user.message}</div>}

                            </div>

                        </Form>
                    )
                }}
                </Formik>
            </div>
        </div>
    )
}
