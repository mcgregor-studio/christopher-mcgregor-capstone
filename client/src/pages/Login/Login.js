import React from "react";
import Link from "../../components/Link/Link";
import Signup from "../Signup/Signup";

export default function Login() {
  return (
    <div className="login">
      <p>This is the login page.</p>
      <Link
        link="auth/google"
        className="button__login google"
        text="Sign in with Google"
      />

      <h3>Login</h3>
      <form className="login__form">
        <input
          className="login__form--input"
          type="text"
          placeholder="Username"
        ></input>
        <input
          className="login__form--input"
          type="email"
          placeholder="Email"
        ></input>
        <input
          className="login__form--input"
          type="password"
          placeholder="Password"
        ></input>
        <input type="submit" value="Login"></input>
      </form>
      <Link link={Signup} className="button__signup" text="Sign up" />
    </div>
  );
}
