import localforage from "localforage";
import { Agent } from "./../../utils/agent";

const agent = new Agent();

export const queryByZipCode = zipCode => dispatch => {
  return dispatch({
    type: "FETCH_EVENTS_BY_ZIP",
    payload: agent
      ._get(`api/listing?zip=${encodeURIComponent(zipCode)}`)
      .then(res => {
        if (res.success) {
          return res;
        }
        return Promise.reject(res);
      })
      .catch(error => {
        if (process.env.NODE_ENV === "development") {
          console.log("there was an error in queryByZipCode action", error);
        }
        return error;
      })
  });
};
