import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

// Route Components
import Homepage from "./Homepage";
import UserRegister from "./UserRegister";
import Snackbar from "@material-ui/core/Snackbar";

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
  constructor(props) {
    super(props);
    this.setSnackbar = this.setSnackbar.bind(this);
    this.hideSnackbar = this.hideSnackbar.bind(this);
    this.state = {
      snackbar: {
        open: false,
        message: ""
      }
    };
  }
  setSnackbar(message = "") {
    console.log("set snackbar with", message);
    this.setState({
      snackbar: {
        open: true,
        message
      }
    });
  }
  hideSnackbar() {
    this.setState({
      ...this.state,
      snackbar: {
        open: false,
        message: ""
      }
    });
  }
  render() {
    const { isAuth } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <section className="bg-vippy">
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
                  return (
                    <UserRegister
                      {...props}
                      isAuth={isAuth}
                      setSnackbar={this.setSnackbar}
                    />
                  );
                }}
              />
              <ProtectedRoute
                isAuth={isAuth}
                path="/dashboard"
                exact
                render={props => (
                  <div
                    className="white"
                    onClick={() =>
                      this.setSnackbar(
                        "Yay, your account was created successfully!"
                      )
                    }
                  >
                    Dashboard
                  </div>
                )}
              />
              <Route path="/*" component={NotFound} />
            </Switch>
          </main>
          <figure>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              autoHideDuration={7500}
              open={this.state.snackbar.open}
              onClose={this.hideSnackbar}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
            >
              <span
                id="message-id"
                className="michroma f7 pv3 ph3 black br2 bg-white b lh-copy tracked tl mb4"
              >
                {this.state.snackbar.message}
              </span>
            </Snackbar>
          </figure>
        </section>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  state => ({ isAuth: state.auth.isAuth }),
  { logout }
)(App);
