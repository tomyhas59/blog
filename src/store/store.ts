import {
  AnyAction,
  Dispatch,
  Middleware,
  applyMiddleware,
  createStore,
} from "redux";
import rootReducer from "../reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga";
import { createLogger } from "redux-logger";

const logger: any = createLogger();

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const enhancer =
    process.env.NODE_ENV === "development"
      ? composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
      : applyMiddleware(sagaMiddleware);

  const store = createStore(rootReducer, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
