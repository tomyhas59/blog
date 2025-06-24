import axios from "axios";
import { fork, takeLatest, put, all, call } from "redux-saga/effects";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_REPLY_FAILURE,
  ADD_REPLY_REQUEST,
  ADD_REPLY_SUCCESS,
  DELETE_ALL_CHAT_FAILURE,
  DELETE_ALL_CHAT_REQUEST,
  DELETE_ALL_CHAT_SUCCESS,
  DELETE_IMAGE_FAILURE,
  DELETE_IMAGE_REQUEST,
  DELETE_IMAGE_SUCCESS,
  GET_COMMENTS_FAILURE,
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  GET_POSTS_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  GET_POST_FAILURE,
  GET_POST_REQUEST,
  GET_POST_SUCCESS,
  LIKE_COMMENT_FAILURE,
  LIKE_COMMENT_REQUEST,
  LIKE_COMMENT_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_REPLY_FAILURE,
  LIKE_REPLY_REQUEST,
  LIKE_REPLY_SUCCESS,
  READ_CHAT_FAILURE,
  READ_CHAT_REQUEST,
  READ_CHAT_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_REPLY_FAILURE,
  REMOVE_REPLY_REQUEST,
  REMOVE_REPLY_SUCCESS,
  SEARCH_POSTS_FAILURE,
  SEARCH_POSTS_REQUEST,
  SEARCH_POSTS_SUCCESS,
  UNLIKE_COMMENT_FAILURE,
  UNLIKE_COMMENT_REQUEST,
  UNLIKE_COMMENT_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_REPLY_FAILURE,
  UNLIKE_REPLY_REQUEST,
  UNLIKE_REPLY_SUCCESS,
  UPDATE_COMMENT_FAILURE,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_REPLY_FAILURE,
  UPDATE_REPLY_REQUEST,
  UPDATE_REPLY_SUCCESS,
} from "../reducer/post";
import { SagaIterator } from "redux-saga";
//-----------------------------------------------------

function getPostsApi(page: number, limit: number, sortBy: string) {
  return axios.get(`/post/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`);
}

function* getPosts(action: {
  page: number;
  limit: number;
  sortBy: string;
}): SagaIterator {
  try {
    const result = yield call(
      getPostsApi,
      action.page,
      action.limit,
      action.sortBy
    );
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

//-----------------------------------------------------

function getCommentsApi(page: number, postId: number) {
  return axios.get(`/post/comment`, { params: { page, postId } });
}

function* getComments(action: { page: number; postId: number }): SagaIterator {
  try {
    const result = yield call(getCommentsApi, action.page, action.postId);
    yield put({
      type: GET_COMMENTS_SUCCESS,
      data: result.data.comments,
      totalComments: result.data.totalComments,
      commentsCount: result.data.commentsCount,
      top3Comments: result.data.top3Comments,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: GET_COMMENTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchGetComments() {
  yield takeLatest<any>(GET_COMMENTS_REQUEST, getComments);
}

//-----------------------------------------------------

function getPostApi(postId: number) {
  return axios.get(`/post/posts/${postId}`);
}

function* getPost(action: { postId: number }): SagaIterator {
  try {
    const result = yield call(getPostApi, action.postId);
    yield put({
      type: GET_POST_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: GET_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchGetPost() {
  yield takeLatest<any>(GET_POST_REQUEST, getPost);
}
//----------------------------------------------
function searchPostsApi(
  searchText: string,
  searchOption: string,
  postId?: number,
  page?: number,
  limit?: number,
  commentOrReplyId?: number,
  category?: string
) {
  return axios.get(
    `/post/search?searchText=${searchText}&searchOption=${searchOption}&postId=${postId}&page=${page}&limit=${limit}`,
    {
      params: { commentOrReplyId, category },
    }
  );
}
function* searchPosts(action: {
  searchText: any;
  searchOption: string;
  postId?: number;
  page?: number;
  limit?: number;
  commentOrReplyId?: number;
  category?: string;
}): SagaIterator {
  try {
    const result = yield call(
      searchPostsApi,
      action.searchText,
      action.searchOption,
      action.postId,
      action.page,
      action.limit,
      action.commentOrReplyId,
      action.category
    );
    yield put({
      type: SEARCH_POSTS_SUCCESS,
      searchedPosts: result.data.searchedPosts,
      totalSearchedPosts: result.data.totalSearchedPosts,
      searchOption: result.data.searchOption,
      postNum: result.data.postNum,
      commentNum: result.data.commentNum,
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
function deleteImagesAPI(data: { postId: any; filename: any }) {
  return axios.delete(`/post/${data.postId}/images/${data.filename}`);
}

function* deleteImages(action: { data: any }): SagaIterator {
  try {
    const result = yield call(deleteImagesAPI, action.data);
    yield put({
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

function updatePostApi(data: any) {
  return axios.put(`/post/update`, data);
}

function* updatePost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(updatePostApi, action.data);
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

function* addComment(action: { data: any }): SagaIterator {
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
  yield takeLatest<any>(ADD_COMMENT_REQUEST, addComment);
}

//-----------------------------------------------------

function removeCommentApi(data: { postId: any; commentId: any }) {
  return axios.delete(`/post/${data.postId}/comment/${data.commentId}`);
}
function* removeComment(action: { data: any }): SagaIterator {
  try {
    const result = yield call(removeCommentApi, action.data);
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

function addReplyApi(data: { postId: any; commentId: any }) {
  return axios.post(
    `/post/${data.postId}/comment/${data.commentId}/reply`,
    data
  );
}

function* addReply(action: { data: any }): SagaIterator {
  try {
    const result = yield call(addReplyApi, action.data);
    console.log(result.data);
    yield put({
      type: ADD_REPLY_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: ADD_REPLY_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddReply() {
  yield takeLatest<any>(ADD_REPLY_REQUEST, addReply);
}

//-----------------------------------------------------

function removeReplyApi(data: { postId: any; commentId: any; replyId: any }) {
  return axios.delete(
    `/post/${data.postId}/comment/${data.commentId}/reply/${data.replyId}`
  );
}
function* removeReply(action: { data: any }): SagaIterator {
  try {
    const result = yield call(removeReplyApi, action.data);
    console.log(result.data);
    yield put({
      type: REMOVE_REPLY_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: REMOVE_REPLY_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemoveReply() {
  yield takeLatest<any>(REMOVE_REPLY_REQUEST, removeReply);
}
//-----------------------------------------------------

function updateReplyApi(data: { postId: any; commentId: any; replyId: any }) {
  return axios.put(
    `/post/${data.postId}/comment/${data.commentId}/reply/${data.replyId}`,
    data
  );
}

function* updateReply(action: { data: any }): SagaIterator {
  try {
    const result = yield call(updateReplyApi, action.data);
    yield put({
      type: UPDATE_REPLY_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.log(err);
    yield put({
      type: UPDATE_REPLY_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchUpdateReply() {
  yield takeLatest<any>(UPDATE_REPLY_REQUEST, updateReply);
}
//-------------------------------------------------------------

function likePostAPI(data: any) {
  return axios.patch(`/post/${data}/like`); //patch 일부분 수정
}

function* likePost(action: { data: any }): SagaIterator {
  try {
    const result = yield call(likePostAPI, action.data);

    yield put({
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

//-------------------------------------------------------------

function likeCommentAPI(data: any) {
  return axios.patch(`/post/${data}/commentLike`); //patch 일부분 수정
}

function* likeComment(action: {
  data: any;
  isTop3Comments?: boolean;
}): SagaIterator {
  try {
    const result = yield call(likeCommentAPI, action.data);
    const { isTop3Comments } = action;

    yield put({
      type: LIKE_COMMENT_SUCCESS,
      data: result.data,
      isTop3Comments,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: LIKE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLikeComment() {
  yield takeLatest<any>(LIKE_COMMENT_REQUEST, likeComment);
}
//-------------------------------------------------------------

function unLikeCommentAPI(data: any) {
  return axios.delete(`/post/${data}/commentLike`);
}

function* unLikeComment(action: {
  data: any;
  isTop3Comments: boolean;
}): SagaIterator {
  try {
    const result = yield call(unLikeCommentAPI, action.data);
    const { isTop3Comments } = action;

    yield put({
      type: UNLIKE_COMMENT_SUCCESS,
      data: result.data,
      isTop3Comments,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: UNLIKE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnLikeComment() {
  yield takeLatest<any>(UNLIKE_COMMENT_REQUEST, unLikeComment);
}
//-------------------------------------------------------------

function likeReplyAPI(data: any) {
  return axios.patch(`/post/${data.commentId}/${data.replyId}/replyLike`); //patch 일부분 수정
}

function* likeReply(action: { data: any }): SagaIterator {
  try {
    const result = yield call(likeReplyAPI, action.data);
    yield put({
      type: LIKE_REPLY_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: LIKE_REPLY_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLikeReply() {
  yield takeLatest<any>(LIKE_REPLY_REQUEST, likeReply);
}
//-------------------------------------------------------------

function unLikeReplyAPI(data: any) {
  return axios.delete(`/post/${data.commentId}/${data.replyId}/replyLike`);
}

function* unLikeReply(action: { data: any }): SagaIterator {
  try {
    const result = yield call(unLikeReplyAPI, action.data);
    yield put({
      type: UNLIKE_REPLY_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: UNLIKE_REPLY_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnLikeReply() {
  yield takeLatest<any>(UNLIKE_REPLY_REQUEST, unLikeReply);
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

function* deleteAllChat(): SagaIterator {
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
    fork(watchGetPost),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchUpdatePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchUpdateComment),
    fork(watchAddReply),
    fork(watchRemoveReply),
    fork(watchUpdateReply),
    fork(watchLikePost),
    fork(watchUnLikePost),
    fork(watchLikeComment),
    fork(watchUnLikeComment),
    fork(watchLikeReply),
    fork(watchUnLikeReply),
    fork(watchSearchPosts),
    fork(watchDeleteImages),
    fork(watchReadChat),
    fork(watchDeleteAllChat),
    fork(watchGetComments),
  ]);
}
