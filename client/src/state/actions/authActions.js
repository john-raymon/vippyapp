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

export const logout = () => dispatch => {
  agent.setToken(null);
  localforage.setItem("jwt", "");
  return dispatch({
    type: "LOGOUT"
  });
};
