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
          className="homepage__paint-tools--icon"
          onClick={() => {
            props.setBrushActive(true);
            props.setEraserActive(false);
            props.setFillActive(false);
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
        <img className="homepage__paint-tools--icon" onClick={() => {
            props.setEraserActive(false);
            props.setBrushActive(false);
            props.setFillActive(true);
          }}src={fill} alt="paint bucket"/>
        <img className="homepage__paint-tools--icon" src={stamp} alt="stamp" />
        <img
          className="homepage__paint-tools--icon"
          onClick={() => {
            props.setEraserActive(true);
            props.setBrushActive(false);
            props.setFillActive(false);
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
          className="homepage__paint-tools--icon"
          src={undo}
          onClick={() => props.setUndo(true)}
          alt="arrow pointing to left"
        />
        <img
          className="homepage__paint-tools--icon"
          onClick={() => props.setClearCanvas(true)}
          src={bomb}
          alt="bomb"
        />
      </div>
    </div>
  );
}
