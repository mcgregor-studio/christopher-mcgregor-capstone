import React, { useRef, useEffect, useState } from "react";
import "./Canvas.scss";

export default function Canvas(props) {
  //Setting initial state and reference for canvas
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("black");
  let [lineWidth, setLineWidth] = useState(3);

  //useEffect hook for brush strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.canvas.width = window.innerWidth - 80;
    ctx.canvas.height = window.innerWidth / 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;
  }, [strokeStyle, lineWidth]);

  //Get mouse location
  let mx = 0;
  let my = 0;
  console.log(mx)
  console.log(my)
  const getMouse = (event) => {
    const canvas = canvasRef.current;
    mx = event.clientX - canvas.offsetLeft;
    my = event.clientY - canvas.offsetTop;
  };

  //Start drawing function
  const startDraw = (event) => {
    getMouse(event)
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(mx, my);
    setIsDrawing(true);
  };

  //End drawing function
  const endDraw = (event) => {
    getMouse(event)
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  //Drawing function
  const draw = (event) => {
    if (!isDrawing) {
      return;
    }
    getMouse(event);
    ctxRef.current.lineTo(mx, my);
    ctxRef.current.stroke();
  };

  //Clear canvas check
  if (props.clearCanvas) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  //Render component with all mouse events and references
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDraw}
      onMouseUp={endDraw}
      onMouseMove={draw}
      className="homepage__canvas"
    ></canvas>
  );
}
