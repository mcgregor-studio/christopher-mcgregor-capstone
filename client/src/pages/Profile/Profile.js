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
      .get(`http://localhost:3100/auth/profile`, {
        headers: {
          authorization: sessionStorage.getItem("token")
        }
      })
      .then((res) => {
       this.setState({ username: res.data.username, email: res.data.email }); 
      })
      .catch((e) => console.error(e));
  }

  render() {

    let { username, email} = this.state;

    return (
      <div className="profile">
        <h1>Welcome, {username}!</h1>
        <p>{email}</p>
      </div>
    );
  }
}
