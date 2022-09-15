import "../style/Login.css";
import LoginForm from "../component/login/LoginForm";
import Footer from "../component/login/Footer";
import RegisterForm from "../component/login/RegisterForm";

function Login() {
  return (
    <div className="login">
      <div className="login_wrapper">
       <LoginForm/>
       <RegisterForm/>
      <Footer/>
      </div>
    </div>
  );
}

export default Login;
