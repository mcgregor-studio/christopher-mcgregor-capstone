import React, { createRef } from "react";
import classNames from "classnames";
import pencil from "../../data/pencil.svg";
import fill from "../../data/fill.svg";
import bomb from "../../data/bomb.svg";
import eraser from "../../data/eraser.svg";
import spray from "../../data/spray.svg";
import stamp from "../../data/stamp.svg";
import swirl from "../../data/swirl.png";
import star from "../../data/star.png";
import cross from "../../data/crosshatch.png";
import dust from "../../data/dust.png";
import "./PaintTools.scss";

export default class PaintTools extends React.Component {
  state = {
    displayModal: false,
    displayWarning: false,
    swirlActive: true,
    starActive: false,
    crossActive: false,
    dustActive: false,
  };

  render() {
    //Reference variables
    const widthRef = createRef();
    const opacityRef = createRef();
    const classes = {
      icon: "paint__tools--modal--icon",
      modal: "paint__tools--modal",
      warning: "paint__tools--warning",
      hidden: "hidden",
      display: "display",
      active: "active",
    };
    let modalClass = classNames(classes.modal, classes.hidden);
    let swirlClass = classNames(classes.icon);
    let starClass = classNames(classes.icon);
    let crossClass = classNames(classes.icon);
    let dustClass = classNames(classes.icon);
    let warningClass = classNames(classes.warning, classes.hidden);
    let {
      displayModal,
      displayWarning,
      swirlActive,
      starActive,
      crossActive,
      dustActive,
    } = this.state;

    //Toggle modal on click function
    const toggleModal = () => {
      if (displayModal) {
        this.setState({ displayModal: false });
        return;
      }
      this.setState({ displayModal: true });
    };

    //Hide modal for other icon clicks
    const hideModal = () => {
      if (displayModal || displayWarning) {
        this.setState({ displayModal: false, displayWarning: false });
        return;
      }
    };

    //Warning toggle
    const warningToggle = () => {
      if (displayWarning) {
        this.setState({ displayWarning: false });
        return;
      }
      this.setState({ displayWarning: true });
    };

    //changing scrub colour
    const changeScrubColour = (target) => {
      const min = target.min;
      const max = target.max;
      const value = target.value;
      target.style.backgroundSize =
        ((value - min) * 100) / (max - min) + "% 100%";
    };
    //if statement to check for modal and warning on re-render
    if (displayModal) {
      modalClass = classNames(classes.modal, classes.display);
    }

    if (displayWarning) {
      warningClass = classNames(classes.warning, classes.display);
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
        <div className="paint__tools--controller">
          <div className="paint__tools--size">
            <div className="paint__tools--slider--icon-s"></div>
            <input
              ref={widthRef}
              className="paint__tools--slider-s"
              type="range"
              min="1"
              max="50"
              value={this.props.lineWidth}
              onInput={() => {
                const widthSlider = widthRef.current;
                changeScrubColour(widthSlider);
              }}
              onChange={(event) => {
                this.props.setLineWidth(event.target.value);
              }}
            ></input>
            <div className="paint__tools--slider--icon--end"></div>
          </div>
          <div className="paint__tools--opacity">
            <div className="paint__tools--slider--icon-o"></div>
            <input
              ref={opacityRef}
              className="paint__tools--slider-o"
              type="range"
              min="1"
              max="100"
              value={this.props.lineOpacity * 100}
              onInput={() => {
                const opacitySlider = opacityRef.current;
                changeScrubColour(opacitySlider);
              }}
              onChange={(event) => {
                this.props.setLineOpacity(event.target.value / 100);
              }}
            ></input>
            <div className="paint__tools--slider--icon--end"></div>
          </div>
          <input
            className="paint__tools--color"
            type="color"
            value={this.props.strokeStyle}
            onChange={(event) => {
              this.props.setStrokeStyle(event.target.value);
            }}
          ></input>
        </div>
        <div>
          <div className="paint__tools--size">
            <img
              className={this.props.pencilClass}
              onClick={() => {
                this.props.setBrushActive(true);
                this.props.setEraserActive(false);
                this.props.setFillActive(false);
                this.props.setStampActive(false);
                this.props.setSprayActive(false);
                hideModal();
              }}
              src={pencil}
              alt="pencil"
            />
            <img
              className={this.props.sprayClass}
              onClick={() => {
                this.props.setEraserActive(false);
                this.props.setBrushActive(false);
                this.props.setFillActive(false);
                this.props.setStampActive(false);
                this.props.setSprayActive(true);
                hideModal();
              }}
              src={spray}
              alt="spray"
            />
            <img
              className={this.props.eraserClass}
              onClick={() => {
                this.props.setEraserActive(true);
                this.props.setBrushActive(false);
                this.props.setFillActive(false);
                this.props.setStampActive(false);
                this.props.setSprayActive(false);
                hideModal();
              }}
              src={eraser}
              alt="eraser"
            />
          </div>
          <div className="paint__tools--click">
            <img
              className={this.props.fillClass}
              onClick={() => {
                this.props.setEraserActive(false);
                this.props.setBrushActive(false);
                this.props.setFillActive(true);
                this.props.setStampActive(false);
                this.props.setSprayActive(false);
                hideModal();
              }}
              src={fill}
              alt="paint bucket"
            />
            <div className="paint__tools--stamp">
              <img
                className={this.props.stampClass}
                onClick={() => {
                  this.props.setEraserActive(false);
                  this.props.setBrushActive(false);
                  this.props.setFillActive(false);
                  this.props.setStampActive(true);
                  this.props.setSprayActive(false);
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
              onClick={() => {
                warningToggle();
                hideModal();
              }}
              src={bomb}
              alt="bomb"
            />
          </div>
        </div>
        <div className={warningClass} onClick={warningToggle}>
          <div>
            <img src={bomb} />
            <p>Are you sure you want to do this?<br /> There's no turning back...</p>
            <div>
              <button
                className="paint__tools--warning--button"
                onClick={() => {
                  this.props.setClearCanvas(true);
                  hideModal();
                }}
              >
                Yes, erase it!
              </button>
              <button
                className="paint__tools--warning--button left"
                onClick={() => {
                  hideModal();
                }}
              >
                I changed my mind!
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
