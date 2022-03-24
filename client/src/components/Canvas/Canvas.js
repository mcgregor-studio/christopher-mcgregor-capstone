import React, { useRef, useEffect, useState } from "react";
import "./Canvas.scss";

export default function Canvas() {
  //Setting initial state and references for canvas
  const canvasRef = useRef(null);
  const coloursRef = useRef(null);
  const ctxRef = useRef(null);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("black");
  let [lineWidth, setLineWidth] = useState(3);
  let [eraserWidth, setEraserWidth] = useState(3);
  let [clearCanvas, setClearCanvas] = useState(false);

  //useEffect hook for canvas and tools
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const colours = coloursRef.current;
    const coloursCtx = colours.getContext('2d');
    let gradient = coloursCtx.createLinearGradient(0,0,0,200)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, "#000");
    coloursCtx.fillStyle = gradient;
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
  const getMouse = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    mx = (event.clientX - rect.left) * scaleX;
    my = (event.clientY - rect.top) * scaleY;
  };

  //Start drawing function
  const startDraw = (event) => {
    getMouse(event);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(mx, my);
    setIsDrawing(true);
  };

  //End drawing function
  const endDraw = (event) => {
    getMouse(event);
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

  //Changing brush/eraser width

  const handleBrush = (event) => {
    setLineWidth(event.target.value);
  };

  const handleEraser = (event) => {
    setEraserWidth(event.target.value);
  };

  //Clear canvas function
  const handleClearCanvas = () => {
    setClearCanvas(true);
  };

  if (clearCanvas) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setClearCanvas(false);
  }

  //Render component with all mouse events and references
  return (
    <div>
      <canvas
        className="homepage__canvas"
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseUp={endDraw}
        onMouseMove={draw}
      ></canvas>
      <div className="homepage__paint-tools">
        <h2>Tools:</h2>
        <h4 className="homepage__paint-tools--label">Brush Size</h4>
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={handleBrush}
        ></input>
        <h4 className="homepage__paint-tools--label">Fill</h4>
        <h4 className="homepage__paint-tools--label">Stamp</h4>
        <h4 className="homepage__paint-tools--label">Eraser</h4>
        <input
          type="range"
          min="1"
          max="10"
          value={eraserWidth}
          onChange={handleEraser}
        ></input>
        <h4 className="homepage__paint-tools--label">Colours</h4>
        <canvas
          className="homepage__paint-tools--colors"
          ref={coloursRef}
        ></canvas>
        <h4 className="homepage__paint-tools--label">Undo/redo?</h4>
        <h4
          className="homepage__paint-tools--label"
          onClick={handleClearCanvas}
        >
          Clear
        </h4>
      </div>
    </div>
  );
}
