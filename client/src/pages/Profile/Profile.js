import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import "./Profile.scss";

export default class Profile extends React.Component {
  state = {
    username: "",
    email: "",
    drawings: [],
    drawingId: "",
  };

  componentDidMount() {
    /*     const SERVER_URL = process.env.GALLERAI_URL;
     */ axios
      .get(`http://localhost:3100/auth/profile`, {
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        this.setState({
          username: res.data.username,
          email: res.data.email,
          drawings: res.data.drawings,
        });
      })
      .catch((e) => console.error(e));
  }

  render() {
    let { username, email, drawings } = this.state;

    return (
      <div className="profile">
        <h1>Welcome, {username}!</h1>
        <p>{email}</p>
        <div>
          {drawings.map((image) => {
            return (
              <Link
                to={{
                  pathname: `/paint/${image.id}`,
                  state: { drawingId: image.id },
                }}
              >
                <img
                  key={image.id}
                  id={image.id}
                  className="profile__thumbnail"
                  src={image.thumbnail}
                  alt="thumbnail"
                />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
