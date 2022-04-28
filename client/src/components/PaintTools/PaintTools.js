import React from "react";
import classNames from "classnames";
import pencil from "../../data/pencil.svg";
import fill from "../../data/fill.svg";
import bomb from "../../data/bomb.svg";
import eraser from "../../data/eraser.svg";
import stamp from "../../data/stamp.svg";
import swirl from "../../data/swirl.png";
import star from "../../data/star.png";
import cross from "../../data/crosshatch.png";
import dust from "../../data/dust.png";
import "./PaintTools.scss";

export default class PaintTools extends React.Component {
  state = {
    displayModal: false,
    swirlActive: true,
    starActive: false,
    crossActive: false,
    dustActive: false,
  };

  render() {
    //Reference variables
    const classes = {
      icon: "paint__tools--modal--icon",
      modal: "paint__tools--modal",
      hidden: "hidden",
      display: "display",
      active: "active",
    };
    let modalClass = classNames(classes.modal, classes.hidden);
    let swirlClass = classNames(classes.icon);
    let starClass = classNames(classes.icon);
    let crossClass = classNames(classes.icon);
    let dustClass = classNames(classes.icon);
    let { displayModal, swirlActive, starActive, crossActive, dustActive } =
      this.state;

    //Toggle modal on click function
    const toggleModal = () => {
      if (displayModal) {
        this.setState({ displayModal: false });
        return;
      }
      this.setState({ displayModal: true });
    };
    //if statement to check for modal on re-render
    if (displayModal) {
      modalClass = classNames(classes.modal, classes.display);
    }

    //Checking for active stamp
    if (swirlActive) {
      swirlClass = classNames(classes.icon, classes.active);
    }

    if (starActive) {
      starClass = classNames(classes.icon, classes.active);
    }

    if (crossActive) {
      crossClass = classNames(classes.icon, classes.active);
    }

    if (dustActive) {
      dustClass = classNames(classes.icon, classes.active);
    }

    //Render component with all mouse events and references
    return (
      <section className="paint__tools">
        <div>
          <div>
          <input
              type="range"
              min="1"
              max="50"
              value={this.props.lineWidth}
              onChange={(event) => {
                this.props.setLineWidth(event.target.value);
              }}
            ></input>
            <img
              className={this.props.pencilClass}
              onClick={() => {
                this.props.setBrushActive(true);
                this.props.setEraserActive(false);
                this.props.setFillActive(false);
                this.props.setStampActive(false);
              }}
              src={pencil}
              alt="pencil"
            />
            <img
              className={this.props.eraserClass}
              onClick={() => {
                this.props.setEraserActive(true);
                this.props.setBrushActive(false);
                this.props.setFillActive(false);
                this.props.setStampActive(false);
              }}
              src={eraser}
              alt="eraser"
            />
          </div>
        </div>
        <div>
          <input
            className="paint__tools--color"
            type="color"
            onChange={(event) => {
              this.props.setStrokeStyle(event.target.value);
            }}
          ></input>
          <img
            className={this.props.fillClass}
            onClick={() => {
              this.props.setEraserActive(false);
              this.props.setBrushActive(false);
              this.props.setFillActive(true);
              this.props.setStampActive(false);
            }}
            src={fill}
            alt="paint bucket"
          />
          <div>
            <img
              className={this.props.stampClass}
              onClick={() => {
                this.props.setEraserActive(false);
                this.props.setBrushActive(false);
                this.props.setFillActive(false);
                this.props.setStampActive(true);
                toggleModal();
              }}
              src={stamp}
              alt="stamp"
            />
            <div className={modalClass}>
              <img
                className={swirlClass}
                onClick={() => {
                  this.props.setStampSource(swirl);
                  toggleModal();
                  this.setState({
                    swirlActive: true,
                    starActive: false,
                    crossActive: false,
                    dustActive: false,
                  });
                }}
                src={swirl}
              />
              <img
                className={starClass}
                onClick={() => {
                  this.props.setStampSource(star);
                  toggleModal();
                  this.setState({
                    swirlActive: false,
                    starActive: true,
                    crossActive: false,
                    dustActive: false,
                  });
                }}
                src={star}
              />
              <img
                className={crossClass}
                onClick={() => {
                  this.props.setStampSource(cross);
                  toggleModal();
                  this.setState({
                    swirlActive: false,
                    starActive: false,
                    crossActive: true,
                    dustActive: false,
                  });
                }}
                src={cross}
              />
              <img
                className={dustClass}
                onClick={() => {
                  this.props.setStampSource(dust);
                  toggleModal();
                  this.setState({
                    swirlActive: false,
                    starActive: false,
                    crossActive: false,
                    dustActive: true,
                  });
                }}
                src={dust}
              />
            </div>
          </div>
          <img
            className={this.props.clearClass}
            onClick={() => this.props.setClearCanvas(true)}
            src={bomb}
            alt="bomb"
          />
        </div>
      </section>
    );
  }
}
