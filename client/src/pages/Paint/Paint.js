import React from "react";
import Main from "../../components/Main/Main";

export default class Paint extends React.Component {
  render() {
    let blankId = "";
    let loginCheck = this.props.loginCheck;

    if (this.props.location.state === undefined) {
      return <Main drawingId={blankId} loginCheck={loginCheck} />;
    }

    return <Main drawingId={this.props.location.state.drawingId} loginCheck={this.props.location.state.loginCheck}/>;
  }
}
