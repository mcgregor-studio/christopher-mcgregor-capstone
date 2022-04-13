import React from "react";

export default function Signup() {
  return (
    <div className="signup">
      <form className="signup__form">
          <input className="signup__form--input" type="text" placeholder="Username"></input>
          <input className="signup__form--input" type="email" placeholder="Email"></input>
          <input className="signup__form--input" type="password" placeholder="Password"></input>
          <input type="submit" value="signup"></input>
      </form>
    </div>
  );
}