import { createStore, applyMiddleware, compose } from "redux";
import createRootReducer from "../state/reducers";
import { createBrowserHistory } from "history";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import { createStateSyncMiddleware } from "redux-state-sync";

// middlewares
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise-middleware";
import logger from "redux-logger";
import { routerMiddleware } from "connected-react-router";

export const history = createBrowserHistory();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"] // only auth will be persisted
};

const persistedReducer = persistReducer(
  persistConfig,
  createRootReducer(history)
);

const configureStore = persistedState => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middlewares = [
    thunkMiddleware,
    logger,
    promiseMiddleware,
    routerMiddleware(history),
    createStateSyncMiddleware({ blacklist: ["@@router/LOCATION_CHANGE"] })
  ];
  let store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  let persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
