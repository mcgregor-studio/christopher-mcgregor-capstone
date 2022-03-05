import React from "react";

export default function PaintTools() {

  const clearCanvas = () => {
    
  }

  return (
  <section className="paint-tools">
    <div>
      <p>Tools:</p>
      <ul>
        <li>Pencil</li>
        <li>Brush</li>
        <li>Bucket</li>
        <li>Stamp</li>
        <li>Eraser</li>
        <li>Colours</li>
        <li>Undo/redo?</li>
        <li onClick={clearCanvas}>Clear canvas</li>
      </ul>
    </div>
  </section>);
}
