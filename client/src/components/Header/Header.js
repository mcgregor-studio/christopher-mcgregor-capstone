import React from "react";
import axios from "axios";
import classNames from "classnames";
import { Link, Redirect } from "react-router-dom";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";
import "./Header.scss";

export default class Header extends React.Component {
  state = {
    isLoggedOut: false,
  };
  render() {
    const classes = {
      logout: "header__logout",
      hidden: "hidden",
      display: "display",
    };

    let logoutClass = classNames(classes.logout, classes.hidden);

    const logout = () => {
      axios
        .get("http://localhost:3100/auth/logout", { withCredentials: true })
        .then(() => {
          this.props.setLoginCheck(false);
          this.setState({ isLoggedOut: true });
        })
        .catch((e) => console.error(e));
    };

    if (this.state.isLoggedOut) {
      return <Redirect to="/" />;
    }

    if (this.props.loginCheck) {
      logoutClass = classNames(classes.logout, classes.display);
    }

    return (
      <header className="header">
        <Menu loginCheck={this.props.loginCheck}/>
        <Link to="/paint">
          <Logo />
        </Link>
        <div>
          <p className={logoutClass} onClick={logout}>
            Logout
          </p>
        </div>
      </header>
    );
  }
}
