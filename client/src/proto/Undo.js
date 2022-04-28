  //Undo
  let [undoArr, setUndoArr] = useState([]);
  let [savedImage, setSavedImage] = useState("");
  let undoClass = className(classes.icon);
  let points = [];

  <img
          className={props.undoClass}
          src={undo}
          onClick={() => props.undo()}
          alt="arrow pointing to left"
        />

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
        console.log("draw done")
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
        console.log("erase done")
      }
      if (path[0].mode === "fill") {        
        fillStart(
          { clientX: path[0].clientX, clientY: path[0].clientY },
          path[0].stroke
        );
        console.log("fill done")
      }
      if (path[0].mode === "stamp") {
        stamp(
          { clientX: path[0].clientX, clientY: path[0].clientY },
          path[0].src,
          path[0].stroke
        );
        console.log("stamp done")
      }
    });
    setUndoArr(next);
  };