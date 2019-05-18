import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

// Components
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
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
    const { classes } = this.props;
    return (
      <header className="pv4">
        <Drawer
          classes={{ paper: classes.paper }}
          open={this.state.drawerState}
          onClose={() => this.toggleDrawer(false)}
        >
          <div className="drawerContainer w100 flex flex-column pr1">
            <div className="logoContainer--noQuery">
              <VippyLogo />
            </div>
            <ul className="drawerContainer__list mt4 ph1 near-white">
              <li className="mv3" onClick={e => this.toggleDrawer()}>
                <p className="michroma f8 tracked-1 ttu lh-extra">sign up</p>
              </li>
              <li className="mv3" onClick={e => this.toggleDrawer()}>
                <p className="michroma f8 tracked-1 ttu lh-extra">sign in</p>
              </li>
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
