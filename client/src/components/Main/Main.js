import React, { useRef, useEffect, useState } from "react";
import PaintTools from "../PaintTools/PaintTools";
import Button from "../Button/Button";
import "./Main.scss";

export default function Main() {
  //Setting initial state and references for canvas
  const canvasRef = useRef(null);
  const coloursRef = useRef(null);
  const ctxRef = useRef(null);
  let [brushActive, setBrushActive] = useState(true);
  let [eraserActive, setEraserActive] = useState(false);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("black");
  let [lineWidth, setLineWidth] = useState(3);
  let [eraserWidth, setEraserWidth] = useState(3);
  let [clearCanvas, setClearCanvas] = useState(false);
  let [loadImage, setLoadImage] = useState(false);
  let [saveImage, setSaveImage] = useState(false);

  //useEffect hook for canvas and tools
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;
  }, [strokeStyle, lineWidth]);

  //Get mouse location to keep mouse position in canvas on resize
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
    if (brushActive) {
    ctxRef.current.lineTo(mx, my);
    ctxRef.current.stroke();
    }
    if (eraserActive) {
      ctxRef.current.clearRect(
        mx - eraserWidth / 2,
        my - eraserWidth / 2,
        eraserWidth,
        eraserWidth
      );
    }
  };

  const dot = (event) => {
    getMouse(event);
    if (brushActive) {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(mx, my);
    ctxRef.current.lineTo(mx, my);
    ctxRef.current.stroke();
    }
    if (eraserActive) {
      ctxRef.current.clearRect(
        mx - eraserWidth / 2,
        my - eraserWidth / 2,
        eraserWidth,
        eraserWidth
      );
    }
  };

  //Loading and saving image handlers
  const handleLoadImage = () => {
    setLoadImage(true);
  };

  const handleSaveImage = () => {
    setSaveImage(true);
  };

  if (clearCanvas) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setClearCanvas(false);
  }

  return (
    <section className="homepage">
      <div>
        <canvas
          className="homepage__canvas"
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseMove={draw}
          onClick={dot}
        ></canvas>
        <PaintTools
          setBrushActive={setBrushActive}
          setEraserActive={setEraserActive}
          setLineWidth={setLineWidth}
          setStrokeStyle={setStrokeStyle}
          setEraserWidth={setEraserWidth}
          setClearCanvas={setClearCanvas}
        />
      </div>
      <div>
        <Button
          onClick={handleLoadImage}
          className="homepage__button--load"
          text="Load Image"
        />
        <Button
          onClick={handleSaveImage}
          className="homepage__button--save"
          text="Save Image"
        />
      </div>
    </section>
  );
}
