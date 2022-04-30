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
    const logout = () => {
      axios
        .get("http://localhost:3100/auth/logout", {
          headers: {
            authorization: sessionStorage.getItem("token"),
          },
        })
        .then(() => {
          sessionStorage.clear();
          this.setState({isLoggedOut: true})
        })
        .catch((e) => console.error(e));
    };

    if (this.state.isLoggedOut) {
      return <Redirect to="/" />;
    }

    return (
      <header className="header">
        <Menu />
        <Link to="/paint">
          <Logo />
        </Link>
        <div className="header__logout">
          <p onClick={logout}>Logout</p>
        </div>
      </header>
    );
  }
}
