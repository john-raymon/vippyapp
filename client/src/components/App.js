import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

// Route Components
import Homepage from "./Homepage";
import UserRegister from "./UserRegister";

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

const ProtectedRoute = ({ component: Component, render, isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuth ? (
          Component ? (
            <Component {...props} />
          ) : (
            render()
          )
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
};

class App extends Component {
  render() {
    const { isAuth } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="bg-vippy">
          <Header isAuth={isAuth} logout={logout} />
          <main className="mainContainer ph3">
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route
                path="/login"
                exact
                render={props => {
                  return (
                    <div className="white">
                      <Link
                        to={{
                          pathname: "/sign-up",
                          state: {
                            from:
                              props.location.state && props.location.state.from
                          }
                        }}
                      >
                        or create an account
                      </Link>
                    </div>
                  );
                }}
              />
              <Route
                path="/sign-up"
                exact
                render={props => {
                  return <UserRegister {...props} isAuth={isAuth} />;
                }}
              />
              <ProtectedRoute
                isAuth={isAuth}
                path="/dashboard"
                exact
                render={props => <div className="white">Dashboard</div>}
              />
              <Route path="/*" component={NotFound} />
            </Switch>
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  state => ({ isAuth: state.auth.isAuth }),
  { logout }
)(App);
