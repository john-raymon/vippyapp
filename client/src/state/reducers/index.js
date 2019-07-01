import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// Reducers
// Example
import auth from "./auth";
import queried from "./queried";
import reservations from "./reservations";
// import dashboard from './dashboard'
// import globals from './globals'

export default history => {
  return combineReducers({
    auth,
    queried,
    reservations,
    router: connectRouter(history)
  });
};
