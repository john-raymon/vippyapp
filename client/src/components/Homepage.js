import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router";

// import Dashboard from './Dashboard'

class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Homepage</p>
      </div>
    );
  }
}

export default Homepage;
