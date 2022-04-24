import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import Paint from "../src/pages/Paint/Paint";
import LoginSignup from "./pages/LoginSignup/LoginSignup";
import Profile from "../src/pages/Profile/Profile";
import AboutContact from "../src/pages/AboutContact/AboutContact";
import React from "react";

export default function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/" exact component={LoginSignup} />
          <Route path="/profile" exact component={Profile} />
          <Route exact path="/paint" component={Paint} />
          <Route path="/paint/:drawingId" component={Paint} />
          <Route path="/about" component={AboutContact} />
          <Route path="/contact" component={AboutContact} />
        </Switch>
      </BrowserRouter>
    </main>
  );
}
