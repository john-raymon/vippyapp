import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link, Redirect, Switch } from "react-router";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

// Route Components
import Homepage from "./Homepage";

// View Components
import Header from "./Header";

// Redux Actions
import { logout } from "../state/actions/authActions";

// Styles
import "../styles/application.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff"
    },
    secondary: {
      main: "#333333"
    },
    divider: "#5d5d5d"
  }
});

const NotFound = props => {
  return <div>Not Found </div>;
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

const ProtectedRoute = connect(
  mapStateToProps,
  null
)(({ component: Component, isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
});

class App extends Component {
  render() {
    const { auth } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="bg-vippy ph3">
          <Header auth={auth} logout={logout} />
          <main className="mainContainer">
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route path="/*" component={NotFound} />
            </Switch>
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  state => ({ auth: state.auth }),
  { logout }
)(App);
