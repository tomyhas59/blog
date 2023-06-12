import { takeEvery, put, all, fork } from "redux-saga/effects";
import { DELETE_POST, MODIFY_POST, REGISTER_POST } from "../reducer/post";

// Redux actions
const registerPostSuccess = (post) => ({
  type: "REGISTER_POST_SUCCESS",
  payload: post,
});

const modifyPostSuccess = (post) => ({
  type: "MODIFY_POST_SUCCESS",
  payload: post,
});

const deletePostSuccess = (postId) => ({
  type: "DELETE_POST_SUCCESS",
  payload: postId,
});

// Redux-saga worker functions
function* registerPost(action) {
  // 실제로 서버에 데이터를 등록하는 비동기 작업 수행
  // 예시에서는 단순히 액션을 발행하는 역할을 수행합니다.
  yield put(registerPostSuccess(action.payload));
}

function* modifyPost(action) {
  // 실제로 서버에서 데이터를 수정하는 비동기 작업 수행
  // 예시에서는 단순히 액션을 발행하는 역할을 수행합니다.
  yield put(modifyPostSuccess(action.payload));
}

function* deletePost(action) {
  // 실제로 서버에서 데이터를 삭제하는 비동기 작업 수행
  // 예시에서는 단순히 액션을 발행하는 역할을 수행합니다.
  yield put(deletePostSuccess(action.payload));
}

// Redux-saga watcher function
export function* watchPostActions() {
  yield takeEvery(REGISTER_POST, registerPost);
  yield takeEvery(MODIFY_POST, modifyPost);
  yield takeEvery(DELETE_POST, deletePost);
}

export default function* postSaga() {
  yield all([fork(watchPostActions)]);
}
