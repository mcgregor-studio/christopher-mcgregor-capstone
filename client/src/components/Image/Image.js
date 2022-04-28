import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import close from "../../data/close.svg";
import "./Image.scss";

export default class Image extends React.Component {
  state = {
    displayModal: false,
  };

  render() {
    //Reference variables
    let yes = `\u2713`;
    let no = `\u2715`;
    const classes = {
      modal: "profile__image--modal",
      hidden: "hidden",
      display: "display",
    };

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
      <div className="profile__image">
        <img
          className="profile__image--close"
          src={close}
          onClick={toggleModal}
          alt="close"
        />
        <div className={modalClass}>
          <p>Are you sure you want to delete this image?</p>
          <input
            className="profile__image--modal--yes"
            type="button"
            value={yes}
            onClick={() => {
              this.props.delImage(this.props.id);
              toggleModal();
            }}
          ></input>
          <input
            className="profile__image--modal--no"
            type="button"
            value={no}
            onClick={toggleModal}
          ></input>
        </div>
        <Link
          to={{
            pathname: `/paint/${this.props.id}`,
            state: { drawingId: this.props.id },
          }}
        >
          <img
            key={this.props.id}
            className="profile__image--thumbnail"
            src={this.props.thumbnail}
            alt="thumbnail"
          />
        </Link>
      </div>
    );
  }
}
