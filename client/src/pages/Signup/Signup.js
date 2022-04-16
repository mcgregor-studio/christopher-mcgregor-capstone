import React from "react";
import "./Signup.scss";

export default function Signup() {
  const handleSignup = (e) => {

  }

  return (
    <div className="signup">
      <form className="signup__form" onSubmit={handleSignup}>
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
        <input type="submit" value="Sign up"></input>
      </form>
    </div>
  );
}
