import React, { useRef, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import className from "classnames";
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
  let [fillActive, setFillActive] = useState(false);
  let [stampActive, setStampActive] = useState(false);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("#000000");
  let [lineWidth, setLineWidth] = useState(10);
  let [eraserWidth, setEraserWidth] = useState(10);
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

  // Variables
  const classes = {
    icon: "homepage__paint-tools--icon",
    active: "active",
  };
  let mx = 0;
  let my = 0;

  let clearClass = className(classes.icon);
  let pencilClass = className(classes.icon);
  let eraserClass = className(classes.icon);
  let fillClass = className(classes.icon);
  let stampClass = className(classes.icon);
  let undoClass = className(classes.icon);
  let points = [];

  // ============= Functions ================= //

  //Get mouse location to keep mouse position in canvas on resize

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

  //Colour helpers
  const testColour = (r, g, b, a) => {
    return r + g + b < 100 && a > 155;
  };

  const hexToRGB = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  //Start drawing
  const startDraw = (event) => {
    if (fillActive) {
      return;
    }
    getMouse(event);
    const ctx = ctxRef.current;

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

  //End drawing
  const endDraw = (event) => {
    getMouse(event);
    ctxRef.current.closePath();
    setUndoArr([...undoArr, points]);
    points = [];
    setIsDrawing(false);
  };

  //Drawing
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

  //Fill
  const fillStart = (event, stroke) => {
    points.push({
      mode: "fill",
      clientX: event.clientX,
      clientY: event.clientY,
      stroke: stroke,
    });
    getMouse(event);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let colourData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let startPos = (Math.round(my) * canvas.width + Math.round(mx)) * 4;
    let startR = colourData.data[startPos],
      startG = colourData.data[startPos + 1],
      startB = colourData.data[startPos + 2];

    let hexR = hexToRGB(stroke).r;
    let hexG = hexToRGB(stroke).g;
    let hexB = hexToRGB(stroke).b;

    if (startR === hexR && startG === hexG && startB === hexB) {
      return;
    }

    const floodFill = (startX, startY, r, g, b) => {
      if (!fillActive) {
        return;
      }

      const lineart = lineartRef.current;
      const lineCtx = lineart.getContext("2d");
      let lineData = lineCtx.getImageData(0, 0, lineart.width, lineart.height);

      const matchColour = (pixelPos, sR, sG, sB) => {
        let lR = lineData.data[pixelPos],
          lG = lineData.data[pixelPos + 1],
          lB = lineData.data[pixelPos + 2],
          lA = lineData.data[pixelPos + 3];
        if (testColour(lR, lG, lB, lA)) {
          return false;
        }

        lR = colourData.data[pixelPos];
        lG = colourData.data[pixelPos + 1];
        lB = colourData.data[pixelPos + 2];

        if (lR === sR && lG === sG && lB === sB) {
          return true;
        }

        if (lR === hexR && lG === hexG && lB === hexB) {
          return false;
        }
        /*         return (Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB) < 255);
         */
      };

      const colourPixel = (pixelPos, newR, newG, newB) => {
        colourData.data[pixelPos] = newR;
        colourData.data[pixelPos + 1] = newG;
        colourData.data[pixelPos + 2] = newB;
        colourData.data[pixelPos + 3] = 255;
      };

      let pixelStack = [[Math.round(startX), Math.round(startY)]];

      while (pixelStack.length) {
        let newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        pixelPos = (y * canvas.width + x) * 4;
        while (y-- >= 0 && matchColour(pixelPos, r, g, b)) {
          pixelPos -= canvas.width * 4;
        }
        pixelPos += canvas.width * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        while (y++ < canvas.height - 1 && matchColour(pixelPos, r, g, b)) {
          colourPixel(pixelPos, hexR, hexG, hexB);

          if (x > 0) {
            if (matchColour(pixelPos - 4, r, g, b)) {
              if (!reachLeft) {
                pixelStack.push([x - 1, y]);
                reachLeft = true;
              }
            } else if (reachLeft) {
              reachLeft = false;
            }
          }

          if (x < canvas.width - 1) {
            if (matchColour(pixelPos + 4, r, g, b)) {
              if (!reachRight) {
                pixelStack.push([x + 1, y]);
                reachRight = true;
              }
            } else if (reachRight) {
              reachRight = false;
            }
          }

          pixelPos += canvas.width * 4;
        }
      }
      ctx.putImageData(colourData, 0, 0);
    };

    floodFill(mx, my, startR, startG, startB);
  };

  //Undo
  const undo = () => {
    undoClass = className(classes.icon, classes.active);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (savedImage) {
      redrawImage(canvasRef, savedImage);
    }
    let next = undoArr.slice(0, -1);
    next = next.filter((elem) => elem.length > 0);
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
        ctx.lineTo(path[0].x, path[0].y);
        if (path.length > 1) {
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
        }
        ctx.stroke();
      }
      if (path[0].mode === "fill") {
        fillStart(
          { clientX: path[0].clientX, clientY: path[0].clientY },
          path[0].stroke
        );
      }
    });
    setUndoArr(next);
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

    saveCanvasCtx.fillStyle = "white";
    saveCanvasCtx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
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
    const lineart = lineartRef.current;
    const lineCtx = lineart.getContext("2d");
    let imgPixels = lineCtx.getImageData(0, 0, lineart.width, lineart.height);
    for (let y = 0; y < imgPixels.height; y++) {
      for (let x = 0; x < imgPixels.width; x++) {
        let i = y * 4 * imgPixels.width + x * 4;
        let avg =
          (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) /
          3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }
    lineCtx.putImageData(imgPixels, 0, 0);
    setUploadImage(false);
  }

  //Clear canvas
  if (clearCanvas) {
    clearClass = className(classes.icon, classes.active);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUndoArr([]);
    setSavedImage("");
    setClearCanvas(false);
  }

  //Checking for other active tools
  if (brushActive) {
    pencilClass = className(classes.icon, classes.active);
  }

  if (eraserActive) {
    eraserClass = className(classes.icon, classes.active);
  }

  if (fillActive) {
    fillClass = className(classes.icon, classes.active);
  }

  if (stampActive) {
    stampClass = className(classes.icon, classes.active);
  }

  return (
    <section className="homepage">
      <div className="homepage__container">
        <canvas
          ref={saveRef}
          className="homepage__save"
          width={500}
          height={500}
        ></canvas>
        <canvas
          ref={lineartRef}
          className="homepage__lineart"
          width={500}
          height={500}
        ></canvas>
        <canvas
          className="homepage__canvas"
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onMouseMove={draw}
          onClick={(event) => {
            fillStart(event, strokeStyle);
          }}
          width={500}
          height={500}
        ></canvas>
      </div>
      <div className="homepage__tools">
        <PaintTools
          clearClass={clearClass}
          pencilClass={pencilClass}
          eraserClass={eraserClass}
          fillClass={fillClass}
          stampClass={stampClass}
          undoClass={undoClass}
          lineWidth={lineWidth}
          eraserWidth={eraserWidth}
          setBrushActive={setBrushActive}
          setEraserActive={setEraserActive}
          setFillActive={setFillActive}
          setStampActive={setStampActive}
          setLineWidth={setLineWidth}
          setStrokeStyle={setStrokeStyle}
          setEraserWidth={setEraserWidth}
          setClearCanvas={setClearCanvas}
          undo={undo}
        />
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
