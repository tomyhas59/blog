import { produce } from "immer";

//전역 상태 초기값
const initialState = {
  allPosts: [],
  imagePaths: [],
  searchPosts: [],

  allPostsLoading: false,
  allPostsDone: false,
  allPostsError: null,

  searchPostsLoading: false,
  searchPostsDone: false,
  searchPostsError: null,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,

  removeImageLoading: false,
  removeImageDone: false,
  removeImageError: null,

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

  likePostLoading: false,
  likePostDone: false,
  likePostError: null,

  unLikePostLoading: false,
  unLikePostDone: false,
  unLikePostError: null,
};

//action명
export const ALL_POSTS_REQUEST = "ALL_POSTS_REQUEST";
export const ALL_POSTS_SUCCESS = "ALL_POSTS_SUCCESS";
export const ALL_POSTS_FAILURE = "ALL_POSTS_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";
export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";

export const REMOVE_IMAGE_REQUEST = "REMOVE_IMAGE_REQUEST";
export const REMOVE_IMAGE_SUCCESS = "REMOVE_IMAGE_SUCCESS";
export const REMOVE_IMAGE_FAILURE = "REMOVE_IMAGE_FAILURE";

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

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const SEARCH_POSTS_REQUEST = "SEARCH_POSTS_REQUEST";
export const SEARCH_POSTS_SUCCESS = "SEARCH_POSTS_SUCCESS";
export const SEARCH_POSTS_FAILURE = "SEARCH_POSTS_FAILURE";

const post = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
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
        draft.imagePaths = [];
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      //-------------------------------------------------------------------
      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS:
        draft.imagePaths = action.data;
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        break;
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;
      //------------------------------------------------------
      case REMOVE_IMAGE_REQUEST:
        draft.removeImageLoading = true;
        draft.removeImageDone = false;
        draft.removeImageError = null;
        break;
      case REMOVE_IMAGE_SUCCESS: {
        draft.removeImageLoading = false;
        draft.imagePaths = draft.imagePaths.filter(
          (v) => v !== action.data.filename
        );
        draft.removeImageDone = true;
        break;
      }
      case REMOVE_IMAGE_FAILURE:
        draft.removeImageLoading = false;
        draft.removeImageError = action.error;
        break;
      //------------------------------------------------------
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
        draft.allPostsError = action.error;
        break;
      //-----------------------------------------------

      //------------------------------------------------------
      case SEARCH_POSTS_REQUEST:
        draft.searchPostsLoading = true;
        draft.searchPostsDone = false;
        draft.searchPostsError = null;
        break;
      case SEARCH_POSTS_SUCCESS:
        draft.searchPostsError = false;
        draft.searchPostsDone = true;
        draft.searchPostsError = false;
        draft.searchPosts = action.data;

        break;
      case SEARCH_POSTS_FAILURE:
        draft.searchPostsLoading = false;
        draft.searchPostsError = action.error;
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
        draft.updateReCommentError = action.error;
        break;
      //-------------------------------------------------------------------

      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS: {
        const post = draft.allPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      }
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;
      //-------------------------------------------------------------------

      case UNLIKE_POST_REQUEST:
        draft.unLikePostLoading = true;
        draft.unLikePostDone = false;
        draft.unLikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS: {
        const post = draft.allPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unLikePostLoading = false;
        draft.unLikePostDone = true;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unLikePostLoading = false;
        draft.unLikePostError = action.error;
        break;
      case "GO_HOME":
        return initialState;
      default:
        return;
    }
  });
};
export default post;
