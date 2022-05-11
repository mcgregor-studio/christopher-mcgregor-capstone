import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import Paint from "../src/pages/Paint/Paint";
import LoginSignup from "./pages/LoginSignup/LoginSignup";
import Profile from "../src/pages/Profile/Profile";
import AboutContact from "../src/pages/AboutContact/AboutContact";
import React, { useState, Fragment } from "react";

export default function App() {
  //State to handle login displays
  let [loginCheck, setLoginCheck] = useState(false);

  return (
    <main className="App">
      <div className="bg"></div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={LoginSignup} />
          <Fragment>
            <Header loginCheck={loginCheck} setLoginCheck={setLoginCheck} />
            <Route
              path="/profile"
              render={(props) => (
                <Profile {...props} loginCheck={loginCheck} setLoginCheck={setLoginCheck} />
              )}
              exact
            />
            <Route
              exact
              path="/paint"
              render={(props) => (
                <Paint {...props} loginCheck={loginCheck} />
              )}
            />
            <Route
              path="/paint/:drawingId"
              render={(props) => (
                <Paint {...props} loginCheck={loginCheck} />
              )}
            />
            <Route path="/about" component={AboutContact} />
            <Route path="/contact" component={AboutContact} />
          </Fragment>
        </Switch>
      </BrowserRouter>
    </main>
  );
}
