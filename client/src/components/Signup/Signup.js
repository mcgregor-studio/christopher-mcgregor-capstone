import React from "react";
import "./Signup.scss";

export default function Signup(props) {

  return (
    <div className={props.className}>      
    <h1 className="signup__form--title">Signup</h1>
      <form className="signup__form" onSubmit={props.handleSignup}>
        <input
          name="username"
          className="signup__form--input"
          type="text"
          placeholder="Username"
        ></input>
        <input
          name="email"
          className="signup__form--input"
          type="email"
          placeholder="Email"
        ></input>
        <input
          name="password"
          className="signup__form--input"
          type="password"
          placeholder="Password"
        ></input>
        <input className="signup__form--submit"type="submit" value="Sign up"></input>
      </form>
    </div>
  );
}
