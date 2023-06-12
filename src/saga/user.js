import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
} from "../reducer/user";
import { put, fork, all, call, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { dummyUser } from "../util/data";
//--------------------------------------------------------
function logInAPI(data) {
  return axios.post("/user/login", data);
}

function* logIn(action) {
  try {
    // const result = yield call(logInAPI, action.data);
    //call: 함수를 실행시킴(함수: 로그인 로직(백엔드 주소를 실행시키는 함수명), 인수:(로그인 데이터(id, pw)))
    yield put({
      //put은 dipatch
      type: LOG_IN_SUCCESS,
      data: dummyUser(action.data),
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}
//--------------------------------------------------------
export default function* userSaga() {
  yield all([fork(watchLogin)]);
  //fork:  함수의 비동기적인 호출 사용
  //call과 달리 순서 상관없이 실행할 때 사용
  //보통은 이벤트 리스너 함수를 실행할 때 사용

  //all : 보통 fork와 함께 사용, 배열 안의 fork를 병렬적으로 모두 실행 그리고 해당 fork가 모두 실행될 때까지 기다리는 역할
}
