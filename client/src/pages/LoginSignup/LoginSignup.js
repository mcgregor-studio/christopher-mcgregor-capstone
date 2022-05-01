import React from "react";
import GoogleButton from "react-google-button";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import "./LoginSignup.scss";

export default class LoginSignup extends React.Component {
  state = {
    isLoggedIn: false,
  };

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to="/profile" />;
    }

    return (
      <section className="login-signup">
        <div className="margin">
          <Logo />
        </div>
        <a href="http://localhost:3100/auth/google">
          <GoogleButton type="light"/>
        </a>
        <Link className="login-signup__button" to="/paint">
          <div>O</div>
          Proceed without profile
        </Link>
      </section>
    );
  }
}
