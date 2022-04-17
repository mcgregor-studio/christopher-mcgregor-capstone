import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.scss";

export default class Login extends React.Component {
  state = {
    isLoggedIn: false,
  };

  render() {
    const SERVER_URL = process.env.GALLERAE_URL;

    const handleLogin = (e) => {
      e.preventDefault();
      axios
        .post(`${SERVER_URL}/auth/login`, {
          email: e.target.email.value,
          password: e.target.password.value,
        })
        .then((res) => {
          console.log(res);
          sessionStorage.setItem("token", res.data.token);
          this.setState({
            isLoggedIn: true,
          });
        })
        .catch((e) => console.error(e));
    };
    return (
      <div className="login">
        <p>This is the login page.</p>

        <a className="button__login google" href={`${SERVER_URL}/auth/google`}>
          Sign in with Google
        </a>
        <h3>Login</h3>
        <form className="login__form" onSubmit={handleLogin}>
          <input
            name="email"
            className="login__form--input"
            type="email"
            placeholder="Email"
          ></input>
          <input
            name="password"
            className="login__form--input"
            type="password"
            placeholder="Password"
          ></input>
          <input type="submit" value="Login"></input>
        </form>
        <Link to="/signup" className="button__signup">
          Sign Up
        </Link>
      </div>
    );
  }
}
