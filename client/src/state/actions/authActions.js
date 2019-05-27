import localforage from "localforage";
import { Agent } from "./../../utils/agent";

const agent = new Agent();

export const attemptLogin = (email, password) => dispatch => {
  return dispatch({
    type: "LOGIN",
    payload: agent
      .authLogin(email, password, "api/user/login")
      .then(res => {
        if (res.success) {
          localforage.setItem("jwt", res.user.token);
          return { ...res, user: { ...res.user, token: undefined } };
        }
        return Promise.reject(res);
      })
      .catch(error => {
        agent.setToken(null);
        localforage.setItem("jwt", "");
        return error;
      })
  });
};

export const register = (user, userAgent) => dispatch => {
  const body = {
    ...user,
    verification_code: user.verificationCode,
    fullname: user.fullName,
    phonenumber: user.phoneNumber,
    zipcode: user.zipCode
  };
  return dispatch({
    type: "USER_REGISTER",
    payload: userAgent.create(body).catch(error => {
      console.log("RAVEN: error in authActions register thunk", error);
      throw error;
    })
  });
};

export const logout = () => dispatch => {
  agent.setToken(null);
  localforage.setItem("jwt", "");
  return dispatch({
    type: "LOGOUT"
  });
};
