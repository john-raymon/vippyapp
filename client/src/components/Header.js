import React, { Component, Fragment } from "react";
// import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

// Components
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";

// svgs
import VippyLogo from "../svgs/logo";

const styles = theme => ({
  paper: {
    background: "#2C2C2C",
    maxWidth: "400px",
    width: "75%",
    paddingLeft: "1rem",
    paddingTop: "4rem"
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.state = {
      drawerState: false
    };
  }

  toggleDrawer(open = !this.state.drawerState) {
    this.setState({
      drawerState: open
    });
  }

  render() {
    const { classes, isAuth = true, user = { firstname: "John" } } = this.props;
    return (
      <header className="pv4 mw8 center">
        <Drawer
          classes={{ paper: classes.paper }}
          open={this.state.drawerState}
          onClose={() => this.toggleDrawer(false)}
        >
          <div className="drawerContainer w100 flex flex-column pr1 flex-grow-1">
            <div className="logoContainer--noQuery">
              <VippyLogo />
            </div>
            {isAuth && (
              <p className="michroma f8 tracked-1 ttu lh-extra white-40 pt1">
                {`hello ${user.firstname}`}
              </p>
            )}
            <div className="flex flex-grow-1 flex-column justify-between pb4">
              <ul className="drawerContainer__list mt3 ph1 near-white">
                {isAuth ? (
                  <Fragment>
                    <li className="mv3" onClick={e => this.toggleDrawer()}>
                      <p className="michroma f8 tracked-1 ttu lh-extra">
                        my account
                      </p>
                    </li>
                    <li className="mv3" onClick={e => this.toggleDrawer()}>
                      <p className="michroma f8 tracked-1 ttu lh-extra">
                        my reservations
                      </p>
                    </li>
                  </Fragment>
                ) : (
                  <Fragment>
                    <li className="mv3" onClick={e => this.toggleDrawer()}>
                      <p className="michroma f8 tracked-1 ttu lh-extra">
                        create an account
                      </p>
                    </li>
                    <li className="mv3" onClick={e => this.toggleDrawer()}>
                      <p className="michroma f8 tracked-1 ttu lh-extra">
                        sign in
                      </p>
                    </li>
                  </Fragment>
                )}
                <li className="mt3 mb3" onClick={e => this.toggleDrawer()}>
                  <p className="michroma f8 tracked-1 ttu lh-extra">
                    browse events near you
                  </p>
                </li>
                <Divider />
                <li className="mv3" onClick={e => this.toggleDrawer()}>
                  <p className="michroma f8 tracked-1 ttu lh-extra">
                    more info/faq
                  </p>
                </li>
                <li className="mv3" onClick={e => this.toggleDrawer()}>
                  <p className="michroma f8 tracked-1 ttu lh-extra">
                    customer support
                  </p>
                </li>
              </ul>
              <p className="michroma f8 tracked-1 ttu lh-extra white-40 pt1 self-end">
                do you run a night club and want to list your events on vippy ?
                get in touch here.
              </p>
            </div>
          </div>
        </Drawer>
        <div className="flex flex-row items-center w-100 justify-between mt4">
          <div className="logoContainer">
            <VippyLogo />
          </div>
          <IconButton color="primary" onClick={() => this.toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </div>
      </header>
    );
  }
}

export default withStyles(styles)(Header);
