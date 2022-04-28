import React from "react";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";
import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <Menu />
      <Logo />
    </header>
  );
}
