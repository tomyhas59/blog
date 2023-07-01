import axios from "axios";
import { fork, takeLatest, put, all, call } from "redux-saga/effects";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
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
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
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
  return axios.delete(`/post/${data.postId}/comment/${data.commentId}`);
}
function* removeComment(action) {
  try {
    const result = yield call(removeCommentApi, action.data);
    console.log(result.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
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

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchUpdatePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchLoadPost),
  ]);
}
