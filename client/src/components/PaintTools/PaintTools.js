import React from "react";
import pencil from "../../data/pencil.svg";
import fill from "../../data/fill.svg";
import bomb from "../../data/bomb.svg";
import eraser from "../../data/eraser.svg";
import stamp from "../../data/stamp.svg";
import undo from "../../data/undo.svg";
import "./PaintTools.scss";

export default function PaintTools(props) {
  //Render component with all mouse events and references
  return (
    <div className="homepage__paint-tools">
      <h2>Tools:</h2>
      <div>
        <img
          className={props.pencilClass}
          onClick={() => {
            props.setBrushActive(true);
            props.setEraserActive(false);
            props.setFillActive(false);
            props.setStampActive(false);
          }}
          src={pencil}
          alt="pencil"
        />
        <input
          type="range"
          min="1"
          max="25"
          value={props.lineWidth}
          onChange={(event) => {
            props.setLineWidth(event.target.value);
          }}
        ></input>
        <input
          className="homepage__paint-tools--color"
          type="color"
          onChange={(event) => {
            props.setStrokeStyle(event.target.value);
          }}
        ></input>
        <img
          className={props.fillClass}
          onClick={() => {
            props.setEraserActive(false);
            props.setBrushActive(false);
            props.setFillActive(true);
            props.setStampActive(false);
          }}
          src={fill}
          alt="paint bucket"
        />
        <img
          className={props.stampClass}
          onClick={() => {
            props.setEraserActive(false);
            props.setBrushActive(false);
            props.setFillActive(false);
            props.setStampActive(true);
          }}
          src={stamp}
          alt="stamp"
        />
        <img
          className={props.eraserClass}
          onClick={() => {
            props.setEraserActive(true);
            props.setBrushActive(false);
            props.setFillActive(false);
            props.setStampActive(false);
          }}
          src={eraser}
          alt="eraser"
        />
        <input
          type="range"
          min="1"
          max="25"
          value={props.eraserWidth}
          onChange={(event) => {
            props.setEraserWidth(event.target.value);
          }}
        ></input>

        <img
          className={props.undoClass}
          src={undo}
          onClick={() => props.undo()}
          alt="arrow pointing to left"
        />
        <img
          className={props.clearClass}
          onClick={() => props.setClearCanvas(true)}
          src={bomb}
          alt="bomb"
        />
      </div>
    </div>
  );
}
