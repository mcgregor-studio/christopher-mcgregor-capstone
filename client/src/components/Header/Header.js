import React from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";
import "./Header.scss";

export default class Header extends React.Component {
  state = {
    isLoggedOut: false
  }
  render() {

    if (this.state.isLoggedOut) {
      return <Redirect to="/" />;
    }

    return (
      <header className="header">
        <Menu />
        <Link to="/paint">
          <Logo />
        </Link>
       {/*  <a href="#" onclick={signOut}>Sign out</a> */}
      </header>
    );
  }
}
