import React from "react";
import Logo from "../Logo/Logo";
import "./Login.scss";

export default function Login(props) {
  return (
    <div className={props.className}>
      <div className="margin">
        <Logo />
      </div>
      <h1 className="login__form--title">Login</h1>
      <form className="login__form" onSubmit={props.handleLogin}>
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
        <input
          className="login__form--submit"
          type="submit"
          value="Login"
        ></input>
      </form>
    </div>
  );
}
