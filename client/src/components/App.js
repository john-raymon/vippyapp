import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router";
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

const ProtectedRoute = ({ component: Component, isAuth, ...rest }) => {
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
};

class App extends Component {
  render() {
    const { auth } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="bg-vippy">
          <Header auth={auth} logout={logout} />
          <main className="mainContainer ph3">
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route path="/sign-up" exact component={UserRegister} />
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
