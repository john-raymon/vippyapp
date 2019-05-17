import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// Reducers
// Example
import auth from "./auth";
// import status from './status'
// import errors from './errors'
// import dashboard from './dashboard'
// import globals from './globals'

export default history => {
  return combineReducers({
    auth,
    router: connectRouter(history)
  });
};
