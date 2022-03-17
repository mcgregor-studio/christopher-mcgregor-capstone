import React from "react";
import Canvas from "../Canvas/Canvas";
import Button from "../Button/Button";
import PaintTools from "../PaintTools/PaintTools";
import "./Main.scss";

export default class Main extends React.Component {
  state = {
    loadImage: false,
    saveImage: false,
    clearCanvas: false
  };

  render() {
    const handleLoadImage = () => {
      this.setState({ loadImage: true });
    };

    const handleSaveImage = () => {
      this.setState({ saveImage: true });
    };

    const handleClearCanvas = () => {
      this.setState({clearCanvas: true});
    };

    let { loadImage, saveImage, clearCanvas } = this.state;
    return (
      <section className="homepage">
        <Canvas loadImage={loadImage} saveImage={saveImage} clearCanvas={clearCanvas} />
        <PaintTools 
        clearCanvas={handleClearCanvas}/>
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
}
