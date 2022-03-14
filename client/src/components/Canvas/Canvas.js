import React, { useRef, useEffect, useState } from "react";
import "./Canvas.scss";

export default function Canvas() {
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
    ctxRef.current = ctx;
  }, [strokeStyle, lineWidth]);

  //Window event listener
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    canvas.width = window.innerWidth - 80;
    canvas.height = window.innerWidth / 2;
    let oldCanvas = canvas.toDataURL("image/png");
    let img = new Image();
    img.src = oldCanvas;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
  };

  window.addEventListener("resize", resizeCanvas);

  //Start drawing function
  const startDraw = (event) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  //End drawing function
  const endDraw = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  //Drawing function
  const draw = (event) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

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
