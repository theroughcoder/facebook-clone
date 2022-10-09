import "../style/Login.css";
import LoginForm from "../component/login/LoginForm";
import Footer from "../component/login/Footer";
import RegisterForm from "../component/login/RegisterForm";
import { useState } from "react";

function Login() {
  const [visible, setVisible] = useState(false)
  return (
    <div className="login">
       <LoginForm setVisible={setVisible} />
       {visible && <RegisterForm setVisible={setVisible} />}
      {/* <Footer/> */}
      </div>
  );
}

export default Login;
