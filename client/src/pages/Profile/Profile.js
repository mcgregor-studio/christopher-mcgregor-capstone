import axios from "axios";
import React from "react";

export default class Profile extends React.Component {
  state = {
    username: "",
    email: "",
    drawings: [],
  };

  componentDidMount() {
    const SERVER_URL = process.env.GALLERAE_URL;
    axios
      .get(`http://localhost:3100/auth/profile`)
      .then((res) => {
          console.log(res)
       /*  this.setState({ username: res.username }); */
      })
      .catch((e) => console.error(e));
  }

  render() {
    return (
      <div className="profile">
        <h1>Welcome, {this.username}!</h1>
      </div>
    );
  }
}
