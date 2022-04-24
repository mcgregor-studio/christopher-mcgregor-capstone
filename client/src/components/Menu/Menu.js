import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import "./Menu.scss";

export default class Menu extends React.Component {
  state = {
    displayModal: false,
  };
  render() {
    const classes = {
      modal: "gallerae__modal--background",
      hidden: "hidden",
      display: "display",
    };

    let drawingId = uuidv4();

    let modalClass = classNames(classes.modal, classes.hidden);

    //Toggle modal on click function
    const toggleModal = () => {
      if (this.state.displayModal) {
        this.setState({ displayModal: false });
        return;
      }
      this.setState({ displayModal: true });
    };
    //if statement to check for modal on re-render
    if (this.state.displayModal) {
      modalClass = classNames(classes.modal, classes.display);
    }

    return (
      <div className="gallerae__menu" onClick={toggleModal}>
        <div className={modalClass}>
          <div className="gallerae__modal">
            <Link
              className="gallerae__modal--item"
              to={{ pathname: "/paint", state: { drawingId: drawingId} }}
            >
              Paint
            </Link>
            <Link className="gallerae__modal--item" to="/profile">
              Profile
            </Link>
            <Link className="gallerae__modal--item" to="/about">
              About
            </Link>
            <Link className="gallerae__modal--item" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
