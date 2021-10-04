// import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import InteractiveMap from "./components/InteractiveMap/InteractiveMap";
import Geocoder from "./components/Geocoder/Geocoder";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Pagina de Inicio</Link>
            </li>
            <li>
              <Link to="/imap">Mapa Interactivo</Link>
            </li>
            <li>
              <Link to="/geocoder">Geocodificador</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/imap">
            <InteractiveMap />
          </Route>
          <Route path="/geocoder">
            <Geocoder />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
