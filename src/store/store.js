import { applyMiddleware, createStore } from "redux";
import rootReducer from "../reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga";
import { createLogger } from "redux-logger";

const logger = createLogger();
//리덕스의 실행 콘솔을 찍어주는 미들웨어를 사용하고 변수에 담아준 것
const sagaMiddleware = createSagaMiddleware();
//리덕스 사가를 실행하기 위해 변수를 담아준 것
//store를 리턴으로 받기 위한 함수
const configureStore = () => {
  const enhancer =
    process.env.NODE_ENV === "development"
      ? composeWithDevTools(applyMiddleware(logger, sagaMiddleware)) //개발환경이면 데브툴즈를 포함, 로거도 포함
      : applyMiddleware(sagaMiddleware);
  //아닐 경우 사가만 포함
  const store = createStore(rootReducer, enhancer);
  sagaMiddleware.run(rootSaga);
  //사가를 실행하는 함수 createStore를 실행할 경우 적용하기 위해 함수 안에 삽입
  return store;
  //설정값 리턴하는 함수
};

export default configureStore;
