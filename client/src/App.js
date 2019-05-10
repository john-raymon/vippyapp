import React, { Component } from "react";
// import logo from "./logo.svg";
import Logo from "./views/Logo";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo />
        </header>
      </div>
    );
  }
}

export default App;
