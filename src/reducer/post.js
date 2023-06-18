import { produce } from "immer";

//전역 상태 초기값
const initialState = {
  allposts: [],
  allpostsLoading: false,
  allpostsDone: false,
  allpostsError: null,

  addpostLoading: false,
  addpostDone: false,
  addpostError: null,

  removepostLoading: false,
  removepostDone: false,
  removepostError: null,

  updatepostLoading: false,
  updatepostDone: false,
  updatepostError: null,

  addcommentLoading: false,
  addcommentDone: false,
  addcommentError: null,

  removecommentLoading: false,
  removecommentDone: false,
  removecommentError: null,

  // updatecommentLoading: false,
  // updatecommentDone: false,
  // updatecommentError: null,
};

//action명
export const ALL_POSTS_REQUEST = "ALL_POSTS_REQUEST";
export const ALL_POSTS_SUCCESS = "ALL_POSTS_SUCCESS";
export const ALL_POSTS_FAILURE = "ALL_POSTS_FAILURE";

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

const post = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ALL_POSTS_REQUEST:
        draft.allpostsLoading = true;
        draft.allpostsDone = false;
        draft.allpostsError = null;
        break;
      case ALL_POSTS_SUCCESS:
        draft.allpostsLoading = false;
        draft.allpostsDone = true;
        draft.allposts = action.data;
        break;
      case ALL_POSTS_FAILURE:
        draft.allpostsLoading = false;
        draft.allpostsDone = true;
        draft.allpostsError = action.error;
        break;
      //-----------------------------------------------------
      case ADD_POST_REQUEST:
        draft.addpostLoading = true;
        draft.addpostDone = false;
        draft.addpostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addpostLoading = false;
        draft.addpostDone = true;
        draft.allposts.unshift(action.data);
        break;
      case ADD_POST_FAILURE:
        draft.addpostLoading = false;
        draft.addpostDone = true;
        draft.addpostError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_POST_REQUEST:
        draft.removepostLoading = true;
        draft.removepostDone = false;
        draft.removepostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removepostLoading = false;
        draft.removepostDone = true;
        draft.allposts = draft.allposts.filter(
          (v) => v.id !== action.data.PostId
        );
        break;
      case REMOVE_POST_FAILURE:
        draft.removepostLoading = false;
        draft.removepostDone = true;
        draft.removepostError = action.error;
        break;
      //-----------------------------------------------------

      case UPDATE_POST_REQUEST:
        draft.updatepostLoading = true;
        draft.updatepostDone = false;
        draft.updatepostError = null;
        break;
      case UPDATE_POST_SUCCESS:
        draft.updatepostLoading = false;
        draft.updatepostDone = true;
        const index = draft.allposts.findIndex(
          (v) => v.id === action.data.PostId
        );
        draft.allposts[index].content = action.data.content;
        break;
      case UPDATE_POST_FAILURE:
        draft.updatepostLoading = false;
        draft.updatepostDone = true;
        draft.updatepostError = action.error;
        break;
      //-----------------------------------------------------

      case ADD_COMMENT_REQUEST:
        draft.addcommentLoading = true;
        draft.addcommentDone = false;
        draft.addcommentError = null;
        break;
      case ADD_COMMENT_SUCCESS:
        draft.addcommentLoading = false;
        draft.addcommentDone = true;
        const postIndex = draft.allposts.findIndex(
          (v) => v.id === action.data.PostId
        );
        draft.allposts[postIndex].Comments.unshift(action.data);
        break;
      case ADD_COMMENT_FAILURE:
        draft.addcommentLoading = false;
        draft.addcommentDone = true;
        draft.addcommentError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_COMMENT_REQUEST:
        draft.removecommentLoading = true;
        draft.removecommentDone = false;
        draft.removecommentError = null;
        break;
      case REMOVE_COMMENT_SUCCESS:
        draft.removecommentLoading = false;
        draft.removecommentDone = true;
        const commentsIndex = draft.allposts.findIndex(
          (v) => v.id === action.data.PostId
        );
        draft.allposts[commentsIndex].Comments = draft.allposts[
          commentsIndex
        ].Comments.filter((v) => v.id !== action.data.CommentId);
        break;
      case REMOVE_COMMENT_FAILURE:
        draft.removecommentLoading = false;
        draft.removecommentDone = true;
        draft.removecommentError = action.error;
        break;
      default:
        return;
    }
  });
};
export default post;
