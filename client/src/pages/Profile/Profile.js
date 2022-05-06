import axios from "axios";
import React from "react";
import GoogleButton from "react-google-button";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import SquareLoader from "react-spinners/SquareLoader";
import Image from "../../components/Image/Image";
import plus from "../../data/plus.svg";
import "./Profile.scss";

export default class Profile extends React.Component {
  state = {
    username: "",
    drawings: [],
    drawingId: "",
    loading: true,
    profile: true,
  };

  componentDidMount() {
    axios
      .get(`http://localhost:3100/auth/profile`, { withCredentials: true })
      .then((res) => {
        console.log(res.data.drawings);
        this.props.setLoginCheck(true);
        this.setState({
          username: res.data.username,
          drawings: res.data.drawings,
          loading: false,
        });
      })
      .then(() => {
        this.state.drawings.forEach((drawing) => {
          axios
            .get(drawing.thumbnail)
            .then()
            .catch((e) => console.error(e));
        });
      })
      .catch((e) => {
        this.setState({ profile: false });
        console.error(e);
      });
  }

  render() {
    //Reference variables
    let { username, drawings, loading, profile } = this.state;
    let newId = uuidv4();
    const override = css`
      display: block;
      margin: 0 auto;
    `;

    //DELETE request for saved images
    const delImage = (id) => {
      axios
        .delete(`http://localhost:3100/auth/profile/${id}`)
        .then(() => {
          axios
            .get(`http://localhost:3100/auth/profile`, {
              withCredentials: true,
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

    if (!loading) {
      if (drawings.length < 12) {
        return (
          <section className="profile">
            <h1 className="profile__title">Welcome, {username}!</h1>
            <p className="profile__text">
              {12 - drawings.length}/12 save slots open
            </p>
            <div className="profile__container">
              {drawings.map((image) => {
                return (
                  <Image
                    thumbnail={image.thumbnail}
                    id={image.id}
                    delImage={delImage}
                    loginCheck={this.props.loginCheck}
                  />
                );
              })}
              <Link
                className="profile__new"
                to={{
                  pathname: "/paint",
                  state: {
                    drawingId: newId,
                    loginCheck: this.props.loginCheck,
                  },
                }}
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
            <p>{drawings.length}/12 save slots used</p>
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
    if (!profile) {
      return (
        <section className="profile">
          <h1 className="profile__loading">No profile available</h1>
          <a href="http://localhost:3100/auth/google">
            <GoogleButton type="light" />
          </a>
        </section>
      );
    }
    return (
      <section className="profile">
        <h1 className="profile__loading">Loading...</h1>
        <div>
          <SquareLoader
            css={override}
            size={150}
            color={"#000000"}
            loading={this.state.loading}
            speedMultiplier={1}
          />
        </div>
      </section>
    );
  }
}
