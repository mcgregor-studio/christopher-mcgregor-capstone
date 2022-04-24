import React from "react";
import Main from "../../components/Main/Main";

export default class Paint extends React.Component {
  render() {
    let drawingId = "";
    if (this.props.location.state === undefined) {
      return <Main drawingId={drawingId} />;
    }

    return <Main drawingId={this.props.location.state.drawingId} />;
  }
}
