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
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,
  REMOVE_IMAGE_FAILURE,
  REMOVE_IMAGE_REQUEST,
  REMOVE_IMAGE_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_RECOMMENT_FAILURE,
  REMOVE_RECOMMENT_REQUEST,
  REMOVE_RECOMMENT_SUCCESS,
  SEARCH_POSTS_FAILURE,
  SEARCH_POSTS_REQUEST,
  SEARCH_POSTS_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UPDATE_COMMENT_FAILURE,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_RECOMMENT_FAILURE,
  UPDATE_RECOMMENT_REQUEST,
  UPDATE_RECOMMENT_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
} from "../reducer/post";
//-----------------------------------------------------

function allPostsApi(data) {
  return axios.get("/post/all", data);
}

function* loadPosts(action) {
  try {
    const result = yield call(allPostsApi, action.data);
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
//----------------------------------------------
function searchPostsApi(query) {
  return axios.get(`/post/search?query=${query}`); // 적절한 검색 API 엔드포인트로 변경
}

function* searchPosts(action) {
  try {
    const result = yield call(searchPostsApi, action.query);
    yield put({
      type: SEARCH_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: SEARCH_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchSearchPosts() {
  yield takeLatest(SEARCH_POSTS_REQUEST, searchPosts);
}
//-----------------------------------------------------

function addPostApi(data) {
  return axios.post("/post", data);
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
//-------------------------------------------------------------
function uploadImagesAPI(data) {
  return axios.post("/post/images", data);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      //put은 dipatch
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages); //마지막 것만
  //throttle("ADD_POST_REQUEST", addPost,2000) 2초 동안 1번 실행
}
//-------------------------------------------------------------
function removeImagesAPI(data) {
  return axios.delete(`/post/images/${data}`);
}

function* removeImages(action) {
  try {
    const result = yield call(removeImagesAPI, action.data);
    yield put({
      //put은 dipatch
      type: REMOVE_IMAGE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_IMAGE_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRemoveImages() {
  yield takeLatest(REMOVE_IMAGE_REQUEST, removeImages); //마지막 것만
  //throttle("ADD_POST_REQUEST", addPost,2000) 2초 동안 1번 실행
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
//-------------------------------------------------------------

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`); //patch 일부분 수정
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      //put은 dipatch
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost); //마지막 것만
  //throttle("ADD_POST_REQUEST", addPost,2000) 2초 동안 1번 실행
}
//-------------------------------------------------------------

function unLikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unLikePost(action) {
  try {
    const result = yield call(unLikePostAPI, action.data);
    yield put({
      //put은 dipatch
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnLikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePost); //마지막 것만
  //throttle("ADD_POST_REQUEST", addPost,2000) 2초 동안 1번 실행
}
export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchUpdatePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchUpdateComment),
    fork(watchAddReComment),
    fork(watchRemoveReComment),
    fork(watchUpdateReComment),
    fork(watchLikePost),
    fork(watchUnLikePost),
    fork(watchUploadImages),
    fork(watchRemoveImages),
    fork(watchSearchPosts),
  ]);
}
