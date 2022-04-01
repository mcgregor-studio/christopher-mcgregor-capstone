import React, { useRef, useEffect, useState } from "react";
import PaintTools from "../PaintTools/PaintTools";
import Button from "../Button/Button";
import "./Main.scss";

export default function Main() {
  //Setting initial state and references for canvas
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lineartRef = useRef(null);
  let [brushActive, setBrushActive] = useState(true);
  let [eraserActive, setEraserActive] = useState(false);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("black");
  let [lineWidth, setLineWidth] = useState(3);
  let [eraserWidth, setEraserWidth] = useState(3);
  let [undo, setUndo] = useState(false);
  let [undoArr, setUndoArr] = useState([]);
  let [clearCanvas, setClearCanvas] = useState(false);
  let [uploadImage, setUploadImage] = useState(false);
  let [imageSource, setImageSource] = useState("");
  let [saveImage, setSaveImage] = useState(false);

  //useEffect hook for canvas and tools
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.eraserWidth = eraserWidth;
    ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;
  }, [strokeStyle, lineWidth, eraserWidth]);

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

  //Undo if statement
  let points = [];
  if (undo) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    setUndoArr(undoArr.splice(-1, 1));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undoArr.forEach((path) => {
      if (path[0].mode === "draw") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = path.stroke;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
      if (path[0].mode === "erase") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(255,255,255,1)";
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
    });
    setUndo(false);
  }

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
    setUndoArr([...undoArr, points]);
    console.log(undoArr);
    points = [];
    setIsDrawing(false);
  };

  //Drawing function
  const draw = (event) => {
    if (!isDrawing) {
      return;
    }
    const ctx = ctxRef.current;
    getMouse(event);
    if (brushActive) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeStyle;
      points.push({ x: mx, y: my, mode: "draw", stroke: ctx.strokeStyle });
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
    if (eraserActive) {
      points.push({ x: mx, y: my, mode: "erase" });
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
  };

  const dot = (event) => {
    getMouse(event);
    const ctx = ctxRef.current;
    if (brushActive) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeStyle;
    }
    if (eraserActive) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(255,255,255,1)";
    }
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(mx, my);
    ctx.stroke();
  };

  //Loading and saving image handlers
  const handleUploadImage = (event) => {
    console.log("fired");
    setImageSource(URL.createObjectURL(event.target.files[0]));
    setUploadImage(true);
  };

  const handleDownloadImage = () => {
    setUploadImage(true);
  };

  const handleSaveImage = () => {
    setSaveImage(true);
  };

  //Upload image
  if (uploadImage) {
    const lineart = lineartRef.current;
    const lineCtx = lineart.getContext("2d");
    let img = new Image();
    img.onload = () => {
      let hRatio = lineart.width / img.width;
      let vRatio = lineart.height / img.height;
      let ratio = Math.min(hRatio, vRatio);
      var centerShift_x = (lineart.width - img.width * ratio) / 2;
      var centerShift_y = (lineart.height - img.height * ratio) / 2;
      lineCtx.clearRect(0, 0, lineart.width, lineart.height);
      lineCtx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
      setUploadImage(false);
    };
    img.src = imageSource;
  }

  //Save image
  if (saveImage) {
  }

  //Clear canvas
  if (clearCanvas) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUndoArr([]);
    setClearCanvas(false);
  }

  return (
    <section className="homepage">
      <div>
        <canvas
          ref={lineartRef}
          className="homepage__lineart"
          width={1000}
          height={500}
        ></canvas>
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
          setUndo={setUndo}
        />
      </div>
      <div>
        <label
          onChange={handleUploadImage}
          for="upload-image"
          className="homepage__button--up"
        >
          Upload Image
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            name="upload-image"
          ></input>
        </label>
        <Button
          onClick={handleDownloadImage}
          className="homepage__button--down"
          text="Download Image"
        />
        <Button
          onClick={handleSaveImage}
          className="homepage__button--save"
          text="Save Image To Profile"
        />
      </div>
    </section>
  );
}
