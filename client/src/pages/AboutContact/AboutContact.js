import React from "react";
import picture from "../../data/about-pic.png";
import "./AboutContact.scss";

export default function AboutContact() {
  return (
    <section className="ac">
      <h1 className="ac__title">About</h1>
      <img className="ac__picture" src={picture} />
      <p className="ac__text">
        Christopher McGregor is a interactive media designer, developer, and
        all-around great guy. He hopes you enjoy 
      </p>
      <p>Show him your stuff</p>
      <a className="ac__link" href="mailto:christopher.mcgregor@hotmail.com">E-mail</a>
      <a className="ac__link" href="https://github.com/mcgregor-studio">GitHub</a>

    </section>
  );
}
