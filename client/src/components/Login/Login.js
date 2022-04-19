import React from "react";
import "./Login.scss";

export default function Login(props) {
  return (
    <div className={props.className}>
      <h3>Login</h3>
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
        <input type="submit" value="Login"></input>
      </form>
    </div>
  );
}
