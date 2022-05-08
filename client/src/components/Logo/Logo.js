import React from "react";
import logo from "../../data/logo-bw.svg";
import "./Logo.scss";

export default function Logo(props) {
  return <img className={props.className} src={logo} alt="Galler.ai logo" />;
}
