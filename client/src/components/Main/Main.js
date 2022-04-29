import React, { useRef, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import className from "classnames";
import PaintTools from "../PaintTools/PaintTools";
import swirl from "../../data/swirl.png";
import bookIcon from "../../data/small.svg";
import activeBookIcon from "../../data/input-end.svg";
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
  let [sprayActive, setSprayActive] = useState(false);
  let [isDrawing, setIsDrawing] = useState(false);
  let [strokeStyle, setStrokeStyle] = useState("#000000");
  let [lineWidth, setLineWidth] = useState(10);
  let [lineOpacity, setLineOpacity] = useState(1);
  let [stampSource, setStampSource] = useState(swirl);
  let [clearCanvas, setClearCanvas] = useState(false);
  let [uploadImage, setUploadImage] = useState(false);
  let [imageSource, setImageSource] = useState("");
  let [samples, setSamples] = useState("");
  let [drawingId, setDrawingId] = useState(uuidv4);
  let [saveWin, setSaveWin] = useState("paint__save--success hidden");
  let [saveLose, setSaveLose] = useState("paint__save--fail hidden");
  let [saveTry, setSaveTry] = useState("paint__save--try hidden");

  //useEffect hooks for canvas and tools
  useEffect(() => {
    axios.get(`http://localhost:3100/auth/samples`).then((result) => {
      setSamples(result.data);
    }).catch(e => console.error(e));

  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;
  }, [strokeStyle, lineWidth, lineOpacity]);

  // Variables
  const classes = {
    icon: "paint__tools--icon",
    bookIcon: "paint__book--icon",
    attempt: "paint__save--try",
    success: "paint__save--success",
    failure: "paint__save--fail",
    active: "active",
    display: "display",
    hidden: "hidden",
  };
  let mx = 0;
  let my = 0;
  let clearClass = className(classes.icon);
  let pencilClass = className(classes.icon);
  let eraserClass = className(classes.icon);
  let fillClass = className(classes.icon);
  let stampClass = className(classes.icon);
  let sprayClass = className(classes.icon);
  let bookClass = className(classes.bookIcon);

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
    if (fillActive || stampActive) {
      return;
    }
    getMouse(event);
    const ctx = ctxRef.current;
    ctx.beginPath();
    if (brushActive) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeStyle;
    }
    if (eraserActive) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(255,255,255,1)";
    }
    if (brushActive || eraserActive) {
      ctx.moveTo(mx, my);
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
    if (sprayActive) {
      spray(event);
    }
    setIsDrawing(true);
  };

  //End drawing
  const endDraw = (event) => {
    if (sprayActive) {
    }
    getMouse(event);
    ctxRef.current.closePath();
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
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
    if (eraserActive) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
    if (sprayActive) {
      spray(event);
    }
  };

  //Click handler for fill and stamp
  const toolClick = (event, stroke, stampItem) => {
    if (stampActive) {
      stamp(event, stampItem);
    }
    if (fillActive) {
      fillStart(event, stroke);
    }
  };

  //Fill
  const fillStart = (event, stroke) => {
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

  //Stamp
  const stamp = (event, source, stroke) => {
    getMouse(event);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let img = new Image();
    img.onload = () => {
      img.style = `color: ${source}`;
      ctx.drawImage(img, mx - img.width / 2, my - img.height / 2);
    };
    img.src = source;
  };

  //Spray
  const spray = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = strokeStyle;
    getMouse(event);
    const randomize = (radius) => {
      let random_angle = Math.random() * (2 * Math.PI);
      let random_radius = Math.random() * radius;

      return {
        x: Math.cos(random_angle) * random_radius,
        y: Math.sin(random_angle) * random_radius,
      };
    };

    const sprayParticles = () => {
      let density = 1;

      for (let i = 0; i < density; i++) {
        let offset = randomize(lineWidth);

        let x = mx + offset.x;
        let y = my + offset.y;

        ctx.fillRect(x, y, 1, 1);
      }
    };

    sprayParticles();
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
    setSaveTry(className(classes.attempt, classes.display));
    setTimeout(function () {
      setSaveTry(className(classes.attempt, classes.hidden));
    }, 3000);

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
          setSaveWin(className(classes.success, classes.display));
          setTimeout(function () {
            setSaveWin(className(classes.success, classes.hidden));
          }, 5000);
          saveCanvasCtx.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
        })
        .catch((e) => {
          console.error(e);
          setSaveLose(className(classes.failure, classes.display));
          setTimeout(function () {
            setSaveLose(className(classes.failure, classes.hidden));
          }, 5000);
        });
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

  if (sprayActive) {
    sprayClass = className(classes.icon, classes.active);
  }

  return (
    <section className="paint">
      <div className="paint__container">
        <canvas
          ref={saveRef}
          className="paint__save"
          width={500}
          height={500}
        ></canvas>
        <canvas
          ref={lineartRef}
          className="paint__lineart"
          width={500}
          height={500}
        ></canvas>
        <canvas
          className="paint__canvas"
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onMouseMove={draw}
          onClick={(event) => {
            toolClick(event, strokeStyle, stampSource);
          }}
          width={500}
          height={500}
        ></canvas>
        <div className="paint__background"></div>
        <div className="paint__book">
          <div onClick={() => {
            redrawImage(lineartRef, samples[0].path)
          }} className={bookClass}></div>
          <div onClick={() => {
            redrawImage(lineartRef, samples[1].path)
          }} className={bookClass}></div>
          <div onClick={() => {
            redrawImage(lineartRef, samples[2].path)
          }} className={bookClass}></div>
          <div onClick={() => {
            redrawImage(lineartRef, samples[3].path)
          }} className={bookClass}></div>
          <div onClick={() => {
            redrawImage(lineartRef, samples[4].path)
          }} className={bookClass}></div>
        </div>
      </div>

      <div className="paint__tools--container">
        <PaintTools
          clearClass={clearClass}
          pencilClass={pencilClass}
          eraserClass={eraserClass}
          fillClass={fillClass}
          stampClass={stampClass}
          sprayClass={sprayClass}
          lineWidth={lineWidth}
          lineOpacity={lineOpacity}
          strokeStyle={strokeStyle}
          setBrushActive={setBrushActive}
          setEraserActive={setEraserActive}
          setFillActive={setFillActive}
          setStampActive={setStampActive}
          setSprayActive={setSprayActive}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
          setStrokeStyle={setStrokeStyle}
          setStampSource={setStampSource}
          setClearCanvas={setClearCanvas}
        />
        <div className="paint__button">
          <label
            onChange={handleUploadImage}
            htmlFor="upload-image"
            className="paint__button--up"
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
            className="paint__button--down"
            onClick={handleDownloadImage}
          >
            Download Image
          </a>
          <button className="paint__button--save" onClick={handleSaveImage}>
            Save Image To Profile
          </button>
          <p className={saveTry}>Saving...</p>
          <p className={saveWin}>Saved!</p>
          <p className={saveLose}>
            No save slots available - please delete a picture
          </p>
        </div>
      </div>
    </section>
  );
}
