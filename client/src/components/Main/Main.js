import React from "react";
import Canvas from "../Canvas/Canvas";
import Button from "../Button/Button";
import PaintTools from "../PaintTools/PaintTools";
import "./Main.scss";

export default function Main() {
  return (
    <section className="homepage">
      <Canvas 
      /* strokeStyle={strokeStyle} 
      lineWidth={lineWidth}  */
      />
      <PaintTools />
      <div>
        <Button className="homepage__button--load" text="Load Image" />
        <Button className="homepage__button--save" text="Save Image" />
      </div>
    </section>
  );
}
