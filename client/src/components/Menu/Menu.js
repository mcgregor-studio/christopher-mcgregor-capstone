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
    //Reference variables
    const classes = {
      modal: "gallerai__modal--background",
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
      <div className="gallerai__menu" onClick={toggleModal}>
        <div className={modalClass}>
          <div className="gallerai__modal">
            <Link
              className="gallerai__modal--item"
              to={{ pathname: "/paint", state: { drawingId: drawingId} }}
            >
              Paint
            </Link>
            <Link className="gallerai__modal--item" to="/profile">
              Profile
            </Link>
            <Link className="gallerai__modal--item" to="/about">
              About
            </Link>
            <Link className="gallerai__modal--item" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
