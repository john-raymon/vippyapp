import React, { Component } from "react";
import { NavLink } from "react-router-dom";

// Components
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";

// svgs
import VippyLogo from "../svgs/logo";

// const styles = theme => ({
//   icon: {
//     color: 'white',
//   }
// });

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <header className="pv4">
        <div className="flex flex-row items-center w-100 justify-between mt4">
          <div className="logoContainer">
            <VippyLogo />
          </div>
          <IconButton color="primary">
            <MenuIcon color="primary" />
          </IconButton>
        </div>
      </header>
    );
  }
}

export default Header;
