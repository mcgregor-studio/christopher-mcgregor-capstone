import React from "react";
import "./AboutContact.scss";

export default function AboutContact() {
  return (
    <section className="ac">
      <h1 className="ac__title">About</h1>
      <p className="ac__text">
        <strong>Galler.ai</strong> is an app designed to aid others to relax by
        allowing them to colour a selection of online drawings, much like the
        current trend of meditative colouring books. These drawings can be saved
        to their profile for them to continue later, or they can save their own
        finished works to their computer to use for other purposes.
      </p>
      <p className="ac__text">Noticed a bug? Want to see more? Get in touch:</p>
      <div className="ac__container">
        <a className="ac__link" href="mailto:christopher.mcgregor@hotmail.com">
          E-mail
        </a>
        <a className="ac__link" href="https://github.com/mcgregor-studio">
          GitHub
        </a>
      </div>
    </section>
  );
}
