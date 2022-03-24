import React from "react";
import Logo from "../Logo/Logo";
import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <Logo />
      <p>This is the header.</p>
    </header>
  );
}
