import React from "react";

export default function PaintTools(props) {
  

  return (
    <section className="paint-tools">
      <div>
        <h2>Tools:</h2>
        <h4 className="paint-tools__label">Brush Size</h4>
        <h4 className="paint-tools__label">Fill</h4>
        <h4 className="paint-tools__label">Stamp</h4>
        <h4 className="paint-tools__label">Eraser</h4>
        <h4 className="paint-tools__label">Colours</h4>
        <canvas className="paint-tools__colors"></canvas>
        <h4 className="paint-tools__label">Undo/redo?</h4>
        <h4 className="paint-tools__label" onClick={props.clearCanvas}>
          Clear
        </h4>
      </div>
    </section>
  );
}
