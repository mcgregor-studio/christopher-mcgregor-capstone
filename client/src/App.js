import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from "./components/Header/Header";
import Home from "../src/pages/Home/Home";

export default function App() {
  return (
    <main className="App">
      <Header />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home}/>
        </Switch>
      </BrowserRouter>
    </main>
  );
}
