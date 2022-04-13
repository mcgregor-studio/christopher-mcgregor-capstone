import React from "react";
import "./Link.scss";

export default function Link(props) {
    const SERVER_URL = process.env.GALLERAE_URL;
    console.log(SERVER_URL)
  return (
    <a className={props.className} href={`${SERVER_URL}/${props.link}`}>
      {props.text}
    </a>
  );
}
