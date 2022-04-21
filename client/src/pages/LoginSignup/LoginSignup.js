import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";
import Login from "../../components/Login/Login";
import Signup from "../../components/Signup/Signup";
import "./LoginSignup.scss";

export default class LoginSignup extends React.Component {
  state = {
    isLoggedIn: false,
    displayLogin: true,
    displaySignup: false,
  };

  render() {
    const SERVER_URL = process.env.GALLERAE_URL;
    const classes = {
      login: "login",
      signup: "signup",
      buttonLogin: "button__login",
      buttonSignup: "button__signup",
      hidden: "hidden",
      display: "display",
    };

    let loginClass = classNames(classes.login, classes.display);
    let signupClass = classNames(classes.signup, classes.hidden);
    let buttonLoginClass = classNames(classes.buttonLogin, classes.hidden);
    let buttonSignupClass = classNames(classes.buttonSignup, classes.display);
    let { displayLogin, displaySignup, isLoggedIn } = this.state;

    //Toggle modal on click function
    const toggleView = () => {
      if (displayLogin) {
        this.setState({ displayLogin: false, displaySignup: true });
        return;
      }
      this.setState({ displayLogin: true, displaySignup: false });
    };
    //if statement to check for modal on re-render
    if (!displayLogin) {
      loginClass = classNames(classes.login, classes.hidden);
      signupClass = classNames(classes.signup, classes.display);
      buttonLoginClass = classNames(classes.buttonLogin, classes.display);
      buttonSignupClass = classNames(classes.buttonSignup, classes.hidden);
    }

    const handleLogin = (e) => {
      e.preventDefault();
      axios
        .post(`http://localhost:3100/auth/login`, {
          email: e.target.email.value,
          password: e.target.password.value,
        })
        .then((res) => {
          sessionStorage.setItem("token", res.data.token);
          this.setState({
            isLoggedIn: true,
          });
        })
        .catch((e) => console.error(e));
    };

    const handleSignup = (e) => {
      e.preventDefault();
      axios
        .post(`http://localhost:3100/auth/signup`, {
          username: e.target.username.value,
          email: e.target.email.value,
          password: e.target.password.value,
        })
        .then((res) => {
          if (res.data.success === "true") {
            sessionStorage.setItem("token", res.data.token);
            this.setState({
              isLoggedIn: true,
            });
          }
        })
        .catch((e) => console.error(e));
    };

    if (isLoggedIn) {
      return <Redirect to="/profile" />;
    }

    return (
      <div className="login-signup">
        <a className="button__login google" href={`${SERVER_URL}/auth/google`}>
          Sign in with Google
        </a>
        <button onClick={toggleView} className={buttonLoginClass}>
          Login
        </button>
        <button onClick={toggleView} className={buttonSignupClass}>
          Signup
        </button>

        <Login className={loginClass} handleLogin={handleLogin} />
        <Signup className={signupClass} handleSignup={handleSignup} />
      </div>
    );
  }
}
