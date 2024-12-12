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
  DELETE_ALL_CHAT_FAILURE,
  DELETE_ALL_CHAT_REQUEST,
  DELETE_ALL_CHAT_SUCCESS,
  DELETE_IMAGE_FAILURE,
  DELETE_IMAGE_REQUEST,
  DELETE_IMAGE_SUCCESS,
  GET_POSTS_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  READ_CHAT_FAILURE,
  READ_CHAT_REQUEST,
  READ_CHAT_SUCCESS,
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
import { SagaIterator } from "redux-saga";
//-----------------------------------------------------

function getPostsApi(data: any) {
  return axios.get("/post/posts", {
    params: {
      page: data.page,
      limit: data.limit,
    },
  });
}

function* getPosts(action: { data: any }): SagaIterator {
  try {
    const result = yield call(getPostsApi, action.data);
    yield put({
      type: GET_POSTS_SUCCESS,
      data: result.data.posts,
      totalPosts: result.data.totalPosts,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: GET_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchGetPosts() {
  yield takeLatest<any>(GET_POSTS_REQUEST, getPosts);
}
//----------------------------------------------
function searchPostsApi(
  query: any,
  searchOption: string,
  postId: number,
  page: number,
  limit: number
) {
  return axios.get(
    `/post/search?query=${query}&searchOption=${searchOption}&postId=${postId}&page=${page}&limit=${limit}`
  );
}
function* searchPosts(action: {
  query: any;
  searchOption: string;
  postId: number;
  page: number;
  limit: number;
}): SagaIterator {
  try {
    const result = yield call(
      searchPostsApi,
      action.query,
      action.searchOption,
      action.postId,
      action.page,
      action.limit
    );
    yield put({
      type: SEARCH_POSTS_SUCCESS,
      searchedPosts: result.data.searchedPosts,
      totalSearchedPosts: result.data.totalSearchedPosts,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: SEARCH_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchSearchPosts() {
  yield takeLatest<any>(SEARCH_POSTS_REQUEST, searchPosts);
}

//-----------------------------------------------------

function addPostApi(data: any) {
  return axios.post("/post", data);
}

function* addPost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(addPostApi, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddPost() {
  yield takeLatest<any>(ADD_POST_REQUEST, addPost);
}
//-------------------------------------------------------------
function uploadImagesAPI(data: any) {
  return axios.post("/post/images", data);
}

function* uploadImages(action: { data: any }): SagaIterator {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      //put은 dipatch
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest<any>(UPLOAD_IMAGES_REQUEST, uploadImages);
}
//-------------------------------------------------------------
function removeImagesAPI(data: any) {
  return axios.delete(`/post/images/${data}`);
}

function* removeImages(action: { data: any }): SagaIterator {
  try {
    const result = yield call(removeImagesAPI, action.data);
    yield put({
      //put은 dipatch
      type: REMOVE_IMAGE_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: REMOVE_IMAGE_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRemoveImages() {
  yield takeLatest<any>(REMOVE_IMAGE_REQUEST, removeImages);
}
//-------------------------------------------------------------
function deleteImagesAPI(data: { postId: any; filename: any }) {
  return axios.delete(`/post/${data.postId}/images/${data.filename}`);
}

function* deleteImages(action: { data: any }): SagaIterator {
  try {
    const result = yield call(deleteImagesAPI, action.data);
    yield put({
      //put은 dipatch
      type: DELETE_IMAGE_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: DELETE_IMAGE_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchDeleteImages() {
  yield takeLatest<any>(DELETE_IMAGE_REQUEST, deleteImages);
}
//-----------------------------------------------------

function removePostApi(data: any) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(removePostApi, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemovePost() {
  yield takeLatest<any>(REMOVE_POST_REQUEST, removePost);
}

//-----------------------------------------------------

function updateApi(data: { postId: any }) {
  return axios.put(`/post/${data.postId}`, data);
}

function* updatePost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(updateApi, action.data);
    yield put({
      type: UPDATE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: UPDATE_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdatePost() {
  yield takeLatest<any>(UPDATE_POST_REQUEST, updatePost);
}

//-----------------------------------------------------

function addCommentApi(data: { postId: any }) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addCommnet(action: { data: any }): SagaIterator {
  try {
    const result = yield call(addCommentApi, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddComment() {
  yield takeLatest<any>(ADD_COMMENT_REQUEST, addCommnet);
}

//-----------------------------------------------------

function removeCommentApi(data: { postId: any; commentId: any }) {
  return axios.delete(`/post/${data.postId}/comment/${data.commentId}`); //component에서 주는 data
}
function* removeComment(action: { data: any }): SagaIterator {
  try {
    const result = yield call(removeCommentApi, action.data); //서버 json에서 주는 data값이 담김
    console.log(result.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemoveComment() {
  yield takeLatest<any>(REMOVE_COMMENT_REQUEST, removeComment);
}
//-----------------------------------------------------

function updateCommentApi(data: { postId: any; commentId: any }) {
  return axios.put(`/post/${data.postId}/comment/${data.commentId}`, data);
}

function* updateComment(action: { data: any }): SagaIterator {
  try {
    const result = yield call(updateCommentApi, action.data);
    yield put({
      type: UPDATE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: UPDATE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdateComment() {
  yield takeLatest<any>(UPDATE_COMMENT_REQUEST, updateComment);
}

//-----------------------------------------------------

function addReCommentApi(data: { postId: any; commentId: any }) {
  return axios.post(
    `/post/${data.postId}/comment/${data.commentId}/reComment`,
    data
  );
}

function* addReComment(action: { data: any }): SagaIterator {
  try {
    const result = yield call(addReCommentApi, action.data);
    console.log(result.data); //서버 json에서 주는 data값이 담김
    yield put({
      type: ADD_RECOMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: ADD_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddReComment() {
  yield takeLatest<any>(ADD_RECOMMENT_REQUEST, addReComment);
}

//-----------------------------------------------------

function removeReCommentApi(data: {
  postId: any;
  commentId: any;
  reCommentId: any;
}) {
  return axios.delete(
    `/post/${data.postId}/comment/${data.commentId}/reComment/${data.reCommentId}`
  ); //component에서 주는 data
}
function* removeReComment(action: { data: any }): SagaIterator {
  try {
    const result = yield call(removeReCommentApi, action.data); //서버 json에서 주는 data값이 담김
    console.log(result.data);
    yield put({
      type: REMOVE_RECOMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: REMOVE_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemoveReComment() {
  yield takeLatest<any>(REMOVE_RECOMMENT_REQUEST, removeReComment);
}
//-----------------------------------------------------

function updateReCommentApi(data: {
  postId: any;
  commentId: any;
  reCommentId: any;
}) {
  return axios.put(
    `/post/${data.postId}/comment/${data.commentId}/reComment/${data.reCommentId}`,
    data
  );
}

function* updateReComment(action: { data: any }): SagaIterator {
  try {
    const result = yield call(updateReCommentApi, action.data);
    yield put({
      type: UPDATE_RECOMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: UPDATE_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdateReComment() {
  yield takeLatest<any>(UPDATE_RECOMMENT_REQUEST, updateReComment);
}
//-------------------------------------------------------------

function likePostAPI(data: any) {
  return axios.patch(`/post/${data}/like`); //patch 일부분 수정
}

function* likePost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      //put은 dipatch
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLikePost() {
  yield takeLatest<any>(LIKE_POST_REQUEST, likePost);
}
//-------------------------------------------------------------

function unLikePostAPI(data: any) {
  return axios.delete(`/post/${data}/like`);
}

function* unLikePost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(unLikePostAPI, action.data);
    yield put({
      //put은 dipatch
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnLikePost() {
  yield takeLatest<any>(UNLIKE_POST_REQUEST, unLikePost);
}

//-----------------------------------------------------

function readChatApi(roomId: number) {
  return axios.get(`/post/getChat?roomId=${roomId}`);
}

function* readChat(action: { data: any }): SagaIterator {
  try {
    const result = yield call(readChatApi, action.data);
    yield put({
      type: READ_CHAT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: READ_CHAT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchReadChat() {
  yield takeLatest<any>(READ_CHAT_REQUEST, readChat);
}

//-----------------------------------------------------

function deleteAllChatApi() {
  return axios.delete("/post/chat/delete");
}

function* deleteAllChat(action: { data: any }): SagaIterator {
  try {
    const result = yield call(deleteAllChatApi);
    yield put({
      type: DELETE_ALL_CHAT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: DELETE_ALL_CHAT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchDeleteAllChat() {
  yield takeLatest<any>(DELETE_ALL_CHAT_REQUEST, deleteAllChat);
}

export default function* postSaga() {
  yield all([
    fork(watchGetPosts),
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
    fork(watchDeleteImages),
    fork(watchReadChat),
    fork(watchDeleteAllChat),
  ]);
}
