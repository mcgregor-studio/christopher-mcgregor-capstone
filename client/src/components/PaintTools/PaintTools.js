import React from "react";
import "./PaintTools.scss";

export default function PaintTools(props) {
  //Render component with all mouse events and references
  return (
    <div className="homepage__paint-tools">
      <h2>Tools:</h2>
      <h4
        className="homepage__paint-tools--label"
        onClick={() => {
          props.setBrushActive(true);
          props.setEraserActive(false);
        }}
      >
        Brush Size
      </h4>
      <input
        type="range"
        min="1"
        max="25"
        onChange={(event) => {
          props.setLineWidth(event.target.value);
        }}
      ></input>
      <h4 className="homepage__paint-tools--label">Fill</h4>
      <h4 className="homepage__paint-tools--label">Stamp</h4>
      <h4 className="homepage__paint-tools--label"
      onClick={() => {
        props.setEraserActive(true);
        props.setBrushActive(false);
      }}>Eraser</h4>
      <input
        type="range"
        min="1"
        max="25"
        onChange={(event) => {
          props.setEraserWidth(event.target.value);
        }}
      ></input>
      <h4 className="homepage__paint-tools--label">Colours</h4>
      <input
        className="homepage__paint-tools--color"
        type="color"
        onChange={(event) => {
          props.setStrokeStyle(event.target.value);
        }}
      ></input>
      <h4 className="homepage__paint-tools--label" onClick={() => props.setUndo(true)}>Undo</h4>
      <h4 className="homepage__paint-tools--label" onClick={() => props.setRedo(true)}>Redo</h4>
      <h4
        className="homepage__paint-tools--label"
        onClick={() => props.setClearCanvas(true)}
      >
        Clear All
      </h4>
    </div>
  );
}
