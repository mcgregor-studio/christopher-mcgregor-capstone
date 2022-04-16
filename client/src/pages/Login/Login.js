import React from "react";
import { Link } from "react-router-dom";
import Signup from "../Signup/Signup";
import "./Login.scss";

export default function Login() {
  const SERVER_URL = process.env.GALLERAE_URL;

  const handleLogin = (e) => {
    
  }
  return (
    <div className="login">
      <p>This is the login page.</p>

      <a className="button__login google" href={`${SERVER_URL}/auth/google`}>
        Sign in with Google
      </a>
      <h3>Login</h3>
      <form className="login__form" onSubmit={handleLogin}>
        <input
          name="username"
          className="login__form--input"
          type="text"
          placeholder="Username"
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
