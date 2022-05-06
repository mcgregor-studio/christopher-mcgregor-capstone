import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import hamburger from "../../data/hamburger.svg";
import "./Menu.scss";

export default class Menu extends React.Component {
  state = {
    displayModal: false,
  };
  render() {
    //Reference variables
    const classes = {
      modal: "menu__modal--background",
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
      <div className="menu__container" onClick={toggleModal}>
        <img className="menu__ham" src={hamburger} alt="hamburger menu" onClick={toggleModal}/>
        <div className={modalClass}>
          <div className="menu__modal">
            <Link
              className="menu__modal--item"
              to={{ pathname: "/paint", state: { drawingId: drawingId, loginCheck: this.props.loginCheck} }}
            >
              Paint
            </Link>
            <Link className="menu__modal--item" to="/profile">
              Profile
            </Link>
            <Link className="menu__modal--item" to="/about">
              About
            </Link>
            <Link className="menu__modal--item" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
