import React, { useRef, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import PaintTools from "../PaintTools/PaintTools";
import "./Main.scss";

export default function Main(props) {
  //Setting initial state and references for canvas
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lineartRef = useRef(null);
  const saveRef = useRef(null);
  const linkRef = useRef();
  let [brushActive, setBrushActive] = useState(true);
  let [eraserActive, setEraserActive] = useState(false);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("black");
  let [lineWidth, setLineWidth] = useState(10);
  let [eraserWidth, setEraserWidth] = useState(10);
  let [undo, setUndo] = useState(false);
  let [undoArr, setUndoArr] = useState([]);
  let [clearCanvas, setClearCanvas] = useState(false);
  let [uploadImage, setUploadImage] = useState(false);
  let [savedImage, setSavedImage] = useState("");
  let [imageSource, setImageSource] = useState("");
  let [drawingId, setDrawingId] = useState(uuidv4);

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
  }, [strokeStyle, lineWidth, eraserWidth, undoArr]);

  // ============= Functions ================= //

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
  //Redraw image
  const redrawImage = (ref, source) => {
    const redraw = ref.current;
    const rdCtx = redraw.getContext("2d");
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let hRatio = redraw.width / img.width;
      let vRatio = redraw.height / img.height;
      let ratio = Math.min(hRatio, vRatio);
      var centerShift_x = (redraw.width - img.width * ratio) / 2;
      var centerShift_y = (redraw.height - img.height * ratio) / 2;
      rdCtx.clearRect(0, 0, redraw.width, redraw.height);
      rdCtx.drawImage(
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
    };
    img.src = source;
  };

  //Start drawing function
  const startDraw = (event) => {
    const ctx = ctxRef.current;
    getMouse(event);
    ctx.beginPath();
    if (brushActive) {
      points.push({
        x: mx,
        y: my,
        mode: "draw",
        stroke: ctx.strokeStyle,
        width: ctx.lineWidth,
      });
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeStyle;
    }
    if (eraserActive) {
      points.push({ x: mx, y: my, mode: "erase", width: ctx.eraserWidth });
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(255,255,255,1)";
    }

    ctx.moveTo(mx, my);
    ctx.lineTo(mx, my);
    ctx.stroke();
    setIsDrawing(true);
  };

  //End drawing function
  const endDraw = (event) => {
    getMouse(event);
    ctxRef.current.closePath();
    setUndoArr([...undoArr, points]);
    points = [];
    console.log(undoArr);
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
      points.push({
        x: mx,
        y: my,
        mode: "draw",
        stroke: ctx.strokeStyle,
        width: ctx.lineWidth,
      });
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
    if (eraserActive) {
      points.push({ x: mx, y: my, mode: "erase", width: ctx.eraserWidth });
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
  };

  //Upload, download, and save image to profile handlers
  const handleUploadImage = (event) => {
    setImageSource(URL.createObjectURL(event.target.files[0]));
    setUploadImage(true);
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    const lineart = lineartRef.current;
    const saveCanvas = saveRef.current;
    const saveCanvasCtx = saveCanvas.getContext("2d");
    const link = linkRef.current;

    saveCanvasCtx.drawImage(canvas, 0, 0);
    saveCanvasCtx.drawImage(lineart, 0, 0);

    let downloadSource = saveCanvas.toDataURL("image/png");
    link.href = downloadSource;

    saveCanvasCtx.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
  };

  const handleSaveImage = () => {
    if (!sessionStorage.getItem("token")) {
      <Redirect to="/" />;
    }

    const canvas = canvasRef.current;
    const lineart = lineartRef.current;
    const saveCanvas = saveRef.current;
    const saveCanvasCtx = saveCanvas.getContext("2d");

    saveCanvasCtx.drawImage(canvas, 0, 0);
    saveCanvasCtx.drawImage(lineart, 0, 0);
    let canvasFile, lineFile, saveFile;
    canvas.toBlob(function (blob) {
      canvasFile = new File([blob], "colours.png", { type: "image/png" });
    }, "image/png");
    lineart.toBlob(function (blob) {
      lineFile = new File([blob], "lineart.png", { type: "image/png" });
      console.log("in function", lineFile);
    }, "image/png");
    saveCanvas.toBlob(function (blob) {
      saveFile = new File([blob], "thumbnail.png", { type: "image/png" });
    }, "image/png");

    let formData = new FormData();

    setTimeout(function () {
      formData.append("colours", canvasFile);
      formData.append("lineart", lineFile);
      formData.append("thumbnail", saveFile);

      axios
        .put("http://localhost:3100/auth/profile", formData, {
          headers: {
            authorization: sessionStorage.getItem("token"),
            drawingId: drawingId,
          },
        })
        .then(() => {
          saveCanvasCtx.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
        })
        .catch((e) => console.error(e));
    }, 3000);
  };

  // ============= If statements ================= //

  //Drawing loaded from profile
  if (props.drawingId && drawingId !== props.drawingId) {
    setDrawingId(props.drawingId);
    axios
      .get(`http://localhost:3100/auth/profile/${props.drawingId}`, {
        headers: {
          authorization: sessionStorage.getItem("token"),
          drawingId: props.drawingId,
        },
      })
      .then((res) => {
        if (res.status === 205) {
          setClearCanvas(true);
          const lineart = lineartRef.current;
          const lineCtx = lineart.getContext("2d");
          lineCtx.clearRect(0, 0, lineart.width, lineart.height);
          return;
        }
        setSavedImage(res.data.colours);
        redrawImage(lineartRef, res.data.lineart);
        redrawImage(canvasRef, res.data.colours);
      })
      .catch((e) => console.error(e));
  }

  //Upload image
  if (uploadImage) {
    redrawImage(lineartRef, imageSource);
    setUploadImage(false);
  }

  //Clear canvas
  if (clearCanvas) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUndoArr([]);
    setSavedImage("");
    setClearCanvas(false);
  }

  //Undo
  let points = [];
  if (undo) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (savedImage) {
      redrawImage(canvasRef, savedImage);
    }
    let next = undoArr.slice(0, -1);
    setUndoArr(next);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    next.forEach((path) => {
      if (path[0].mode === "draw") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = path[0].stroke;
        ctx.lineWidth = path[0].width;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
      if (path[0].mode === "erase") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.eraserWidth = path[0].width;
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
    });
    setUndo(false);
  }

  return (
    <section className="homepage">
      <div>
        <canvas
          ref={saveRef}
          className="homepage__save"
          width={1000}
          height={500}
        ></canvas>
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
          width={1000}
          height={500}
        ></canvas>
        <PaintTools
          lineWidth={lineWidth}
          eraserWidth={eraserWidth}
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
          htmlFor="upload-image"
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
        <a
          ref={linkRef}
          download="gallerai-image.png"
          href=""
          className="homepage__button--down"
          onClick={handleDownloadImage}
        >
          Download Image
        </a>
        <button className="homepage__button--save" onClick={handleSaveImage}>
          Save Image To Profile
        </button>
      </div>
    </section>
  );
}
