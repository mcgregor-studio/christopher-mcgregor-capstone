import axios from "axios";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import Image from "../../components/Image/Image";
import plus from "../../data/plus.svg";
import "./Profile.scss";

export default class Profile extends React.Component {
  state = {
    username: "",
    drawings: [],
    drawingId: "",
    isLoaded: false,
  };

  componentDidMount() {
    axios
      .get(`http://localhost:3100/auth/profile`, {
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        this.setState({
          username: res.data.username,
          drawings: res.data.drawings,
          isLoaded: true,
        });
      })
      .catch((e) => console.error(e));
  }

  render() {
    //Reference variables
    let { username, drawings, isLoaded } = this.state;
    let newId = uuidv4();

    //DELETE request for saved images
    const delImage = (id) => {
      axios
        .delete(`http://localhost:3100/auth/profile/${id}`, {
          headers: {
            authorization: sessionStorage.getItem("token"),
            drawingId: id,
          },
        })
        .then(() => {
          axios
            .get(`http://localhost:3100/auth/profile`, {
              headers: {
                authorization: sessionStorage.getItem("token"),
              },
            })
            .then((res) => {
              this.setState({
                username: res.data.username,
                drawings: res.data.drawings,
              });
            })
            .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
    };

    if (isLoaded) {
      if (drawings.length < 12) {
        return (
          <section className="profile">
            <h1 className="profile__title">Welcome, {username}!</h1>
            <div className="profile__container">
              {drawings.map((image) => {
                return (
                  <Image
                    thumbnail={image.thumbnail}
                    id={image.id}
                    delImage={delImage}
                  />
                );
              })}
              <Link
                className="profile__new"
                to={{ pathname: "/paint", state: { drawingId: newId } }}
              >
                <img className="profile__new--icon" alt="plus" src={plus} />
              </Link>
            </div>
          </section>
        );
      }
      return (
        <section className="profile">
          <h1 className="profile__title">Welcome, {username}!</h1>
          <div className="profile__container">
            {drawings.map((image) => {
              return (
                <Image
                  thumbnail={image.thumbnail}
                  id={image.id}
                  delImage={delImage}
                />
              );
            })}
          </div>
        </section>
      );
    }
    return (<h1>Loading...</h1>)
  }
}
