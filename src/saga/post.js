import axios from "axios";
import { fork, takeLatest, put, all, call } from "redux-saga/effects";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_RECOMMENT_FAILURE,
  ADD_RECOMMENT_REQUEST,
  ADD_RECOMMENT_SUCCESS,
  ALL_POSTS_FAILURE,
  ALL_POSTS_REQUEST,
  ALL_POSTS_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_RECOMMENT_FAILURE,
  REMOVE_RECOMMENT_REQUEST,
  REMOVE_RECOMMENT_SUCCESS,
  UPDATE_COMMENT_FAILURE,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_RECOMMENT_FAILURE,
  UPDATE_RECOMMENT_REQUEST,
  UPDATE_RECOMMENT_SUCCESS,
} from "../reducer/post";
//-----------------------------------------------------

function allPostsApi() {
  return axios.get("/post/all");
}

function* loadPosts() {
  try {
    const result = yield call(allPostsApi);
    yield put({
      type: ALL_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: ALL_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadPosts() {
  yield takeLatest(ALL_POSTS_REQUEST, loadPosts);
}
//-----------------------------------------------------

function loadPostApi() {
  return axios.get("/post");
}

function* loadPost() {
  try {
    const result = yield call(loadPostApi);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}
//-----------------------------------------------------

function addPostApi(data) {
  return axios.post("/post", { content: data });
}

function* addPost(action) {
  try {
    const result = yield call(addPostApi, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

//-----------------------------------------------------

function removePostApi(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    const result = yield call(removePostApi, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

//-----------------------------------------------------

function updateApi(data) {
  return axios.put(`/post/${data.postId}`, data);
}

function* updatePost(action) {
  try {
    const result = yield call(updateApi, action.data);
    yield put({
      type: UPDATE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: UPDATE_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdatePost() {
  yield takeLatest(UPDATE_POST_REQUEST, updatePost);
}

//-----------------------------------------------------

function addCommentApi(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addCommnet(action) {
  try {
    const result = yield call(addCommentApi, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addCommnet);
}

//-----------------------------------------------------

function removeCommentApi(data) {
  return axios.delete(`/post/${data.postId}/comment/${data.commentId}`); //component에서 주는 data
}
function* removeComment(action) {
  try {
    const result = yield call(removeCommentApi, action.data); //서버 json에서 주는 data값이 담김
    console.log(result.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data, //여기 바꿨더니 됨
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}
//-----------------------------------------------------

function updateCommentApi(data) {
  return axios.put(`/post/${data.postId}/comment/${data.commentId}`, data);
}

function* updateComment(action) {
  try {
    const result = yield call(updateCommentApi, action.data);
    yield put({
      type: UPDATE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: UPDATE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdateComment() {
  yield takeLatest(UPDATE_COMMENT_REQUEST, updateComment);
}

//-----------------------------------------------------

function addReCommentApi(data) {
  return axios.post(
    `/post/${data.postId}/comment/${data.commentId}/reComment`,
    data
  );
}

function* addReComment(action) {
  try {
    const result = yield call(addReCommentApi, action.data);
    console.log(result.data); //서버 json에서 주는 data값이 담김
    yield put({
      type: ADD_RECOMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: ADD_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddReComment() {
  yield takeLatest(ADD_RECOMMENT_REQUEST, addReComment);
}

//-----------------------------------------------------

function removeReCommentApi(data) {
  return axios.delete(
    `/post/${data.postId}/comment/${data.commentId}/reComment/${data.reCommentId}`
  ); //component에서 주는 data
}
function* removeReComment(action) {
  try {
    const result = yield call(removeReCommentApi, action.data); //서버 json에서 주는 data값이 담김
    console.log(result.data);
    yield put({
      type: REMOVE_RECOMMENT_SUCCESS,
      data: result.data, //여기 바꿨더니 됨
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: REMOVE_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemoveReComment() {
  yield takeLatest(REMOVE_RECOMMENT_REQUEST, removeReComment);
}
//-----------------------------------------------------

function updateReCommentApi(data) {
  return axios.put(
    `/post/${data.postId}/comment/${data.commentId}/reComment/${data.reCommentId}`,
    data
  );
}

function* updateReComment(action) {
  try {
    const result = yield call(updateReCommentApi, action.data);
    yield put({
      type: UPDATE_RECOMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: UPDATE_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdateReComment() {
  yield takeLatest(UPDATE_RECOMMENT_REQUEST, updateReComment);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchUpdatePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchLoadPost),
    fork(watchUpdateComment),
    fork(watchAddReComment),
    fork(watchRemoveReComment),
    fork(watchUpdateReComment),
  ]);
}
