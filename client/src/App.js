import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from "./components/Header/Header";
import Home from "../src/pages/Home/Home";
import Login from "../src/pages/Login/Login";
import Profile from "../src/pages/Profile/Profile";
import AboutContact from "../src/pages/AboutContact/AboutContact";

export default function App() {
  return (
    <main className="App">
      
      <BrowserRouter>
      <Header />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/home" component={Home}/>
          <Route path="/about" component={AboutContact} />
          <Route path="/contact" component={AboutContact} />
        </Switch>
      </BrowserRouter>
    </main>
  );
}
