import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

const RegisterFormTextField = ({ ...rest }) => {
  return (
    <TextField
      InputProps={{
        className: `michroma-important lh-title f7-important MUIRegisterOverride`
      }}
      InputLabelProps={{
        className: "michroma-important white-important o-80"
      }}
      fullWidth={true}
      {...rest}
    />
  );
};
/**
   * 1. on first submit, save all form date, init request to twilio withonly phone number
   * 2. if first step successful, set state hasInitVerif to true, display neccessary UI such different submit button,
   *    showing field for verification code, also showing resend code button, if not successful display errors
   * 3. on second submit, with verifcation code, make request the CREATE users endpoint
   *    attempt to create user with verification code, display errors if not successful
        if user wants to verify with another number they will have to click a change number button and have the
        the ui change accordingly to init proper request on future submit
   * 4. if second submit successful, then user will be registered and proper state will be updated
   */
class UserRegister extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      hasInitVerif: false
    };
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
        <p className="michroma f6 tracked ttc yellow o-70">error</p>
        <form className="registerComponent__form flex flex-column mw6 mt4">
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
