import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

const RegisterFormTextField = ({ ...rest }) => {
  return (
    <TextField
      InputProps={{
        className: `michroma-important lh-title f7-important MUIRegisterOverride`
      }}
      InputLabelProps={{
        className: "michroma-important white-important"
      }}
      fullWidth={true}
      {...rest}
    />
  );
};

class UserRegister extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault();
    alert("form submitted");
  }
  render() {
    return (
      <div className="registerComponent flex flex-column mw8 center justify-center pv4 ph2">
        <h1 className="michroma tracked lh-title white ttc f3 f2-ns pr4 mb4">
          easily register <br /> below
        </h1>
        <form className="registerComponent__form flex flex-column mw6">
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="What's your email address?"
              type="email"
              label="Email"
            />
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Enter your Phone Number"
              type="text"
              label="Phone Number"
            />
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Create a password"
              type="password"
              label="Password"
            />
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Confirm your password"
              type="password"
              label="Confirm Password"
            />
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Ex. Nova Rae"
              type="text"
              label="Full Name"
            />
          </div>
          <button
            className="vippyButton mt4 mw1 self-end"
            onClick={this.onFormSubmit}
            type="submit"
          >
            <div className="vippyButton__innerColorBlock">
              <div className="w-100 h-100 flex flex-column justify-center">
                <p className="michroma f8 tracked-1 b ttu lh-extra white-90 center pb1">
                  sign up
                </p>
              </div>
            </div>
          </button>
        </form>
      </div>
    );
  }
}

export default UserRegister;
