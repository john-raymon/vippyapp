import React, { Component, Fragment } from "react";
import * as yup from "yup";
import {
  phoneNumber as phoneNumberRegExp,
  password as passwordRegExp
} from "./../utils/regExp";
import { UserEndpointAgent as UserAgent } from "./../utils/agent";

// material-ui components
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
    this.validate = this.validate.bind(this);
    this.resetErrorsState = this.resetErrorsState.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.sendOnBoardCode = this.sendOnBoardCode.bind(this);
    this.userAgent = new UserAgent();
    this.state = {
      hasInitVerif: false,
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      error: ""
    };
  }
  resetErrorsState() {
    const allErrors = Object.keys(this.state).reduce((allErrors, key) => {
      const allKeyChars = key.toLowerCase();
      if (allKeyChars.slice(-5) === "error") {
        allErrors[key] = undefined;
      }
      return allErrors;
    }, {});
    this.setState({
      error: "",
      ...allErrors
    });
  }
  sendOnBoardCode(phoneNumber, email) {
    return this.userAgent.sendOnBoardCode(phoneNumber, email);
  }
  validate(user) {
    const userSchema = yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Your email is required"),
      phoneNumber: yup
        .string()
        .matches(phoneNumberRegExp, {
          message: "Your phone must be a valid phone number"
        })
        .label("Phone number")
        .required("You must provide a phone number"),
      password: yup
        .string()
        .min("8", "Password is too short - should be 8 chars minimum")
        .matches(passwordRegExp, {
          message:
            "Your password must have a minimum of eight characters, and at least one number"
        })
        .required("Oops, please create a password"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords don't match")
        .required("You must confirm the password"),
      fullName: yup.string().required("Your full name is required")
    });
    return userSchema.validate(user, { abortEarly: false });
  }
  handleFormChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onFormSubmit(e) {
    e.preventDefault();
    this.resetErrorsState();
    const newUser = {
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      fullName: this.state.fullName,
      verficationCode: ""
    };
    return this.validate(newUser)
      .then(user => {
        this.setState({
          ...this.state,
          prevValidatedUser: user
        });
        return this.sendOnBoardCode(user.phoneNumber, user.email);
      })
      .then(res => {
        if (res.success) {
          return this.setState({
            ...this.state,
            hasInitVerif: true
          });
        } else {
          return Promise.reject({
            message:
              res.error ||
              "We are experiencing issues while attempting to send your number a verification. Please try a different number or try again later."
          });
        }
      })
      .catch(error => {
        // catch validation errors, and map them path/state name
        if (error.name === "ValidationError") {
          const errorsByPath = error.inner.reduce((errorsByPath, error) => {
            errorsByPath[`${error.path}Error`] = error.message;
            return errorsByPath;
          }, {});
          return this.setState({
            ...this.state,
            ...errorsByPath
          });
        }
        this.setState({
          error: error.message || error.error
        });
      });
  }
  render() {
    const {
      error,
      hasInitVerif,
      prevValidatedUser = {
        fullName: "Nova Rae"
      }
    } = this.state;
    return (
      <div className="registerComponent flex flex-column mw8 center justify-center pv4 ph2">
        {hasInitVerif ? (
          <h1 className="michroma tracked lh-title white ttc f3 f2-ns pr4 mb2 mw6">
            {`Almost done ${
              prevValidatedUser.fullName.split(" ")[0]
            }, thank you for trying Vippy!`}
            ,
          </h1>
        ) : (
          <h1 className="michroma tracked lh-title white ttc f3 f2-ns pr4 mb2">
            easily register <br /> below
          </h1>
        )}
        {error && (
          <p className="michroma f6 tracked ttc yellow lh-copy o-70 pt2 pb4">
            {error}
          </p>
        )}
        {hasInitVerif && (
          <p className="michroma f6 tracked ttc yellow o-70 pt3 pb2 lh-copy">
            We're texting you a verifcation code, enter it below.
          </p>
        )}
        <form
          className="registerComponent__form flex flex-column mw6 mt2"
          onChange={this.handleFormChange}
        >
          {hasInitVerif && (
            <Fragment>
              <div className="mb2 w-100">
                <RegisterFormTextField
                  placeholder="Enter your verfication code"
                  type="text"
                  label="Verfication Code"
                  name="verficationCode"
                  value={this.state.verifcationCode}
                />
              </div>
              <button
                className="vippyButton mt3 mb4 mw1 self-end"
                onClick={this.onFormSubmit}
                type="submit"
              >
                <div className="vippyButton__innerColorBlock">
                  <div className="w-100 h-100 flex flex-column justify-center">
                    <p className="michroma f8 tracked-1 b ttu lh-extra white-90 center pb1">
                      verify
                    </p>
                  </div>
                </div>
              </button>
            </Fragment>
          )}
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="What's your email address?"
              type="email"
              label="Email"
              name="email"
              value={this.state.email}
            />
            {this.state.emailError && (
              <p className="michroma f7 red o-60 pt1 tracked lh-copy">
                {this.state.emailError}
              </p>
            )}
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Enter your Phone Number"
              type="text"
              label="Phone Number"
              name="phoneNumber"
              value={this.state.phoneNumber}
              disabled={hasInitVerif}
            />
            {this.state.phoneNumberError && (
              <p className="michroma f7 red o-60 pt1 tracked lh-copy">
                {this.state.phoneNumberError}
              </p>
            )}
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Create a password"
              type="password"
              label="Password"
              name="password"
              value={this.state.password}
            />
            {this.state.passwordError && (
              <p className="michroma f7 red o-60 pt1 tracked lh-copy">
                {this.state.passwordError}
              </p>
            )}
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Confirm your password"
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={this.state.confirmPassword}
            />
            {this.state.confirmPasswordError && (
              <p className="michroma f7 red o-60 pt1 tracked lh-copy">
                {this.state.confirmPasswordError}
              </p>
            )}
          </div>
          <div className="mb3 w-100">
            <RegisterFormTextField
              placeholder="Ex. Nova Rae"
              type="text"
              label="Full Name"
              name="fullName"
              value={this.state.fullName}
            />
            {this.state.fullNameError && (
              <p className="michroma f7 red o-60 pt1 tracked lh-copy">
                {this.state.fullNameError}
              </p>
            )}
          </div>
          {!hasInitVerif && (
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
          )}
        </form>
      </div>
    );
  }
}

export default UserRegister;
