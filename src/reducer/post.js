import { produce } from "immer";

//전역 상태 초기값
const initialState = {
  allPosts: [],
  allPostsLoading: false,
  allPostsDone: false,
  allPostsError: null,

  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,

  removeCommentLoading: false,
  removeCommentDone: false,
  removeCommentError: null,

  updateCommentLoading: false,
  updateCommentDone: false,
  updateCommentError: null,

  addReCommentLoading: false,
  addReCommentDone: false,
  addReCommentError: null,

  removeReCommentLoading: false,
  removeReCommentDone: false,
  removeReCommentError: null,

  updateReCommentLoading: false,
  updateReCommentDone: false,
  updateReCommentError: null,
};

//action명
export const ALL_POSTS_REQUEST = "ALL_POSTS_REQUEST";
export const ALL_POSTS_SUCCESS = "ALL_POSTS_SUCCESS";
export const ALL_POSTS_FAILURE = "ALL_POSTS_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const UPDATE_POST_REQUEST = "UPDATE_POST_REQUEST";
export const UPDATE_POST_SUCCESS = "UPDATE_POST_SUCCESS";
export const UPDATE_POST_FAILURE = "UPDATE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const REMOVE_COMMENT_REQUEST = "REMOVE_COMMENT_REQUEST";
export const REMOVE_COMMENT_SUCCESS = "REMOVE_COMMENT_SUCCESS";
export const REMOVE_COMMENT_FAILURE = "REMOVE_COMMENT_FAILURE";

export const UPDATE_COMMENT_REQUEST = "UPDATE_COMMENT_REQUEST";
export const UPDATE_COMMENT_SUCCESS = "UPDATE_COMMENT_SUCCESS";
export const UPDATE_COMMENT_FAILURE = "UPDATE_COMMENT_FAILURE";

export const ADD_RECOMMENT_REQUEST = "ADD_RECOMMENT_REQUEST";
export const ADD_RECOMMENT_SUCCESS = "ADD_RECOMMENT_SUCCESS";
export const ADD_RECOMMENT_FAILURE = "ADD_RECOMMENT_FAILURE";

export const REMOVE_RECOMMENT_REQUEST = "REMOVE_RECOMMENT_REQUEST";
export const REMOVE_RECOMMENT_SUCCESS = "REMOVE_RECOMMENT_SUCCESS";
export const REMOVE_RECOMMENT_FAILURE = "REMOVE_RECOMMENT_FAILURE";

export const UPDATE_RECOMMENT_REQUEST = "UPDATE_RECOMMENT_REQUEST";
export const UPDATE_RECOMMENT_SUCCESS = "UPDATE_RECOMMENT_SUCCESS";
export const UPDATE_RECOMMENT_FAILURE = "UPDATE_RECOMMENT_FAILURE";

const post = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ALL_POSTS_REQUEST:
        draft.allPostsLoading = true;
        draft.allPostsDone = false;
        draft.allPostsError = null;
        break;
      case ALL_POSTS_SUCCESS:
        draft.allPostsLoading = false;
        draft.allPostsDone = true;
        draft.allPosts = draft.allPosts.concat(action.data);
        break;
      case ALL_POSTS_FAILURE:
        draft.allPostsLoading = false;
        draft.allPostsDone = true;
        draft.allPostsError = action.error;
        break;
      //-----------------------------------------------------
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.allPosts.unshift(action.data);
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.addPostError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.allPosts = draft.allPosts.filter(
          (v) => v.id !== action.data.PostId //백엔드의 json의 PostId
        );
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.removePostError = action.error;
        break;
      //-----------------------------------------------------

      case UPDATE_POST_REQUEST:
        draft.updatePostLoading = true;
        draft.updatePostDone = false;
        draft.updatePostError = null;
        break;
      case UPDATE_POST_SUCCESS: {
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        draft.allPosts[postIndex].content = action.data.content;
        break;
      }
      case UPDATE_POST_FAILURE:
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        draft.updatePostError = action.error;
        break;
      //-----------------------------------------------------

      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        draft.allPosts[postIndex].Comments.push(action.data); //unshift 제일 위로 올라옴, push 제일 마지막에 위치
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        draft.addCommentError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_COMMENT_REQUEST:
        draft.removeCommentLoading = true;
        draft.removeCommentDone = false;
        draft.removeCommentError = null;
        break;
      case REMOVE_COMMENT_SUCCESS: {
        draft.removeCommentLoading = false;
        draft.removeCommentDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        draft.allPosts[postIndex].Comments = draft.allPosts[
          postIndex
        ].Comments.filter((v) => v.id !== action.data.CommentId);
        break;
      }
      case REMOVE_COMMENT_FAILURE:
        draft.removeCommentLoading = false;
        draft.removeCommentDone = true;
        draft.removeCommentError = action.error;
        break;
      //---------------------------------------------------

      case UPDATE_COMMENT_REQUEST:
        draft.updateCommentLoading = true;
        draft.updateCommentDone = false;
        draft.updateCommentError = null;
        break;
      case UPDATE_COMMENT_SUCCESS: {
        draft.updateCommentLoading = false;
        draft.updateCommentDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        const commentIndex = draft.allPosts[postIndex].Comments.findIndex(
          (v) => v.id === action.data.CommentId
        );
        draft.allPosts[postIndex].Comments[commentIndex].content =
          action.data.content; //post 안의 Comments안에 있는 content를 찾아서 바꾸므로 배열값 넣어줌
        break;
      }

      case UPDATE_COMMENT_FAILURE:
        draft.updateCommentLoading = false;
        draft.updateCommentDone = true;
        draft.updateCommentError = action.error;
        break;
      //-----------------------------------------------------

      case ADD_RECOMMENT_REQUEST:
        draft.addReCommentLoading = true;
        draft.addReCommentDone = false;
        draft.addReCommentError = null;
        break;
      case ADD_RECOMMENT_SUCCESS: {
        draft.addReCommentLoading = false;
        draft.addReCommentDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        const commentIndex = draft.allPosts[postIndex].Comments.findIndex(
          (v) => v.id === action.data.CommentId
        );
        draft.allPosts[postIndex].Comments[commentIndex].ReComments.push(
          action.data
        );
        break;
      }
      case ADD_RECOMMENT_FAILURE:
        draft.addReCommentLoading = false;
        draft.addReCommentDone = true;
        draft.addReCommentError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_RECOMMENT_REQUEST:
        draft.removeReCommentLoading = true;
        draft.removeReCommentDone = false;
        draft.removeReCommentError = null;
        break;
      case REMOVE_RECOMMENT_SUCCESS: {
        draft.removeReCommentLoading = false;
        draft.removeReCommentDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        const commentIndex = draft.allPosts[postIndex].Comments.findIndex(
          (v) => v.id === action.data.CommentId
        );
        draft.allPosts[postIndex].Comments[commentIndex].ReComments =
          draft.allPosts[postIndex].Comments[commentIndex].ReComments.filter(
            (v) => v.id !== action.data.ReCommentId
          );
        break;
      }
      case REMOVE_RECOMMENT_FAILURE:
        draft.removeReCommentLoading = false;
        draft.removeReCommentDone = true;
        draft.removeReCommentError = action.error;
        break;
      //---------------------------------------------------

      case UPDATE_RECOMMENT_REQUEST:
        draft.updateReCommentLoading = true;
        draft.updateReCommentDone = false;
        draft.updateReCommentError = null;
        break;
      case UPDATE_RECOMMENT_SUCCESS: {
        draft.updateReCommentLoading = false;
        draft.updateReCommentDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        const commentIndex = draft.allPosts[postIndex].Comments.findIndex(
          (v) => v.id === action.data.CommentId
        );
        const reCommentIndex = draft.allPosts[postIndex].Comments[
          commentIndex
        ].ReComments.findIndex((v) => v.id === action.data.ReCommentId);

        draft.allPosts[postIndex].Comments[commentIndex].ReComments[
          reCommentIndex
        ].content = action.data.content; //post 안의 Comments안의 ReComments 안에 있는 content를 찾아서 바꾸므로 배열값 넣어줌
        break;
      }

      case UPDATE_RECOMMENT_FAILURE:
        draft.updateReCommentLoading = false;
        draft.updateReCommentDone = true;
        draft.updateReCommentError = action.error;
        break;
      default:
        return;
    }
  });
};
export default post;
