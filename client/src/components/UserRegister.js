import React, { Component } from "react";

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
        <h1 className="michroma tracked lh-title white ttc f3 f2-ns pr4">
          easily register <br /> below
        </h1>
        <form className="registerComponent__form">
          <button
            className="vippyButton mt2 mw1 self-end"
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
