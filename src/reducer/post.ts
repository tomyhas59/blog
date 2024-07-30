import { produce } from "immer";
import { Message, PostType } from "../types";

//전역 상태 초기값
const initialState = {
  allPosts: [] as PostType[],
  imagePaths: [] as string[],
  searchPosts: [] as PostType[],
  chatMessages: [] as Message[],

  allPostsLoading: false,
  allPostsDone: false,
  allPostsError: null,

  searchPostsLoading: false,
  searchPostsDone: false,
  searchPostsError: null,

  searchNicknameLoading: false,
  searchNicknameDone: false,
  searchNicknameError: null,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,

  removeImageLoading: false,
  removeImageDone: false,
  removeImageError: null,

  deleteImageLoading: false,
  deleteImageDone: false,
  deleteImageError: null,

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

  readChatLoading: false,
  readChatDone: false,
  readChatError: null,
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

export const DELETE_IMAGE_REQUEST = "DELETE_IMAGE_REQUEST";
export const DELETE_IMAGE_SUCCESS = "DELETE_IMAGE_SUCCESS";
export const DELETE_IMAGE_FAILURE = "DELETE_IMAGE_FAILURE";

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

export const SEARCH_NICKNAME_REQUEST = "SEARCH_NICKNAME_REQUEST";
export const SEARCH_NICKNAME_SUCCESS = "SEARCH_NICKNAME_SUCCESS";
export const SEARCH_NICKNAME_FAILURE = "SEARCH_NICKNAME_FAILURE";

export const READ_CHAT_REQUEST = "READ_CHAT_REQUEST";
export const READ_CHAT_SUCCESS = "READ_CHAT_SUCCESS";
export const READ_CHAT_FAILURE = "READ_CHAT_FAILURE";

export const DELETE_ALL_CHAT_REQUEST = "DELETE_ALL_CHAT_REQUEST";
export const DELETE_ALL_CHAT_SUCCESS = "DELETE_ALL_CHAT_SUCCESS";
export const DELETE_ALL_CHAT_FAILURE = "DELETE_ALL_CHAT_FAILURE";

const post = (state = initialState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "REFRESH":
        return initialState;
      case "CANCEL_MODIFY":
        draft.imagePaths = [];
        break;
      case "RESET_CHAT_MESSAGES":
        draft.chatMessages = [];
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
        draft.imagePaths = [...draft.imagePaths, ...action.data];
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
      case DELETE_IMAGE_REQUEST:
        draft.deleteImageLoading = true;
        draft.deleteImageDone = false;
        draft.deleteImageError = null;
        break;
      case DELETE_IMAGE_SUCCESS: {
        draft.deleteImageLoading = false;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        const imageIndex = draft.allPosts[postIndex].Images.findIndex(
          (v: { src: any }) => v.src === action.data.filename
        );
        if (imageIndex > -1) {
          draft.allPosts[postIndex].Images.splice(imageIndex, 1);
        }
        draft.deleteImageDone = true;
        break;
      }
      case DELETE_IMAGE_FAILURE:
        draft.deleteImageLoading = false;
        draft.deleteImageError = action.error;
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

      //------------------------------------------------------
      case SEARCH_POSTS_REQUEST:
        draft.searchPostsLoading = true;
        draft.searchPostsDone = false;
        draft.searchPostsError = null;
        break;
      case SEARCH_POSTS_SUCCESS:
        draft.searchPostsLoading = false;
        draft.searchPostsError = null;
        draft.searchPostsDone = true;
        draft.searchPosts = action.data;
        break;
      case SEARCH_POSTS_FAILURE:
        draft.searchPostsLoading = false;
        draft.searchPostsError = action.error;
        break;
      //-----------------------------------------------
      case SEARCH_NICKNAME_REQUEST:
        draft.searchNicknameLoading = true;
        draft.searchNicknameDone = false;
        draft.searchNicknameError = null;
        break;
      case SEARCH_NICKNAME_SUCCESS:
        draft.searchNicknameLoading = false;
        draft.searchNicknameError = null;
        draft.searchNicknameDone = true;
        draft.searchPosts = action.data;
        break;
      case SEARCH_NICKNAME_FAILURE:
        draft.searchNicknameLoading = false;
        draft.searchNicknameError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS: {
        draft.removePostLoading = false;
        draft.removePostDone = true;
        const postIndex = draft.allPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        if (postIndex > -1) {
          draft.allPosts.splice(postIndex, 1);
        }
        //search
        draft.searchPosts = draft.searchPosts.filter(
          (v) => v.id !== action.data.PostId
        );
        break;
      }
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
        draft.allPosts[postIndex] = action.data.updatePost;
        //search

        const searchPostIndex = draft.searchPosts.findIndex(
          (v) => v.id === action.data.PostId //백엔드의 json의 PostId
        );
        draft.searchPosts[searchPostIndex] = action.data.updatePost;

        draft.imagePaths = [];
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
        draft.allPosts[postIndex].Comments.push(action.data);

        //search
        if (draft.searchPosts.length > 0) {
          const searchPostIndex = draft.searchPosts.findIndex(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          draft.searchPosts[searchPostIndex].Comments.push(action.data);
        }
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
        ].Comments.filter((v: { id: any }) => v.id !== action.data.CommentId);

        //search
        if (draft.searchPosts.length > 0) {
          const searchPostIndex = draft.searchPosts.findIndex(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          draft.searchPosts[searchPostIndex].Comments = draft.searchPosts[
            searchPostIndex
          ].Comments.filter((v: { id: any }) => v.id !== action.data.CommentId);
        }

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
          (v: { id: any }) => v.id === action.data.CommentId
        );
        draft.allPosts[postIndex].Comments[commentIndex].content =
          action.data.content; //post 안의 Comments안에 있는 content를 찾아서 바꾸므로 배열값 넣어줌

        //search
        if (draft.searchPosts.length > 0) {
          const searchPostIndex = draft.searchPosts.findIndex(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          const searchCommentIndex = draft.searchPosts[
            searchPostIndex
          ].Comments.findIndex(
            (v: { id: any }) => v.id === action.data.CommentId
          );
          draft.searchPosts[searchPostIndex].Comments[
            searchCommentIndex
          ].content = action.data.content;
        }

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
          (v: { id: any }) => v.id === action.data.CommentId
        );
        draft.allPosts[postIndex].Comments[commentIndex].ReComments.push(
          action.data
        );

        //search
        if (draft.searchPosts.length > 0) {
          const searchPostIndex = draft.searchPosts.findIndex(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          const searchCommentIndex = draft.searchPosts[
            searchPostIndex
          ].Comments.findIndex(
            (v: { id: any }) => v.id === action.data.CommentId
          );
          draft.searchPosts[searchPostIndex].Comments[
            searchCommentIndex
          ].ReComments.push(action.data);
        }

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
          (v: { id: any }) => v.id === action.data.CommentId
        );
        draft.allPosts[postIndex].Comments[commentIndex].ReComments =
          draft.allPosts[postIndex].Comments[commentIndex].ReComments.filter(
            (v: { id: any }) => v.id !== action.data.ReCommentId
          );
        //search
        if (draft.searchPosts.length > 0) {
          const searchPostIndex = draft.searchPosts.findIndex(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          const searchCommentIndex = draft.searchPosts[
            searchPostIndex
          ].Comments.findIndex(
            (v: { id: any }) => v.id === action.data.CommentId
          );

          draft.searchPosts[searchPostIndex].Comments[
            searchCommentIndex
          ].ReComments = draft.searchPosts[searchPostIndex].Comments[
            searchCommentIndex
          ].ReComments.filter(
            (v: { id: any }) => v.id !== action.data.ReCommentId
          );
        }

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
          (v: { id: any }) => v.id === action.data.CommentId
        );
        const reCommentIndex = draft.allPosts[postIndex].Comments[
          commentIndex
        ].ReComments.findIndex(
          (v: { id: any }) => v.id === action.data.ReCommentId
        );

        draft.allPosts[postIndex].Comments[commentIndex].ReComments[
          reCommentIndex
        ].content = action.data.content; //post 안의 Comments안의 ReComments 안에 있는 content를 찾아서 바꾸므로 배열값 넣어줌
        //search
        if (draft.searchPosts.length > 0) {
          const searchPostIndex = draft.searchPosts.findIndex(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          const searchCommentIndex = draft.searchPosts[
            searchPostIndex
          ].Comments.findIndex(
            (v: { id: any }) => v.id === action.data.CommentId
          );
          const searchReCommentIndex = draft.searchPosts[
            searchPostIndex
          ].Comments[searchCommentIndex].ReComments.findIndex(
            (v: { id: any }) => v.id === action.data.ReCommentId
          );

          draft.searchPosts[searchPostIndex].Comments[
            searchCommentIndex
          ].ReComments[searchReCommentIndex].content = action.data.content;
        }

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
        if (post) {
          post.Likers.push({
            id: action.data.UserId,
            nickname: action.data.nickname,
          });
        }
        //search
        if (draft.searchPosts.length > 0) {
          const searchPost = draft.searchPosts.find(
            (v) => v.id === action.data.PostId //백엔드의 json의 PostId
          );
          if (searchPost) {
            searchPost.Likers.push({
              id: action.data.UserId,
              nickname: action.data.nickname,
            });
          }
        }
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
        post!.Likers = post!.Likers.filter(
          (v: { id: any }) => v.id !== action.data.UserId
        );

        //search
        if (draft.searchPosts.length > 0) {
          const searchPost = draft.searchPosts.find(
            (v) => v.id === action.data.PostId
          );
          searchPost!.Likers = searchPost!.Likers.filter(
            (v: { id: any }) => v.id !== action.data.UserId
          );
        }
        draft.unLikePostLoading = false;
        draft.unLikePostDone = true;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unLikePostLoading = false;
        draft.unLikePostError = action.error;
        break;

      //-------------------------------------------------------
      case READ_CHAT_REQUEST:
        draft.readChatLoading = true;
        draft.readChatDone = false;
        draft.readChatError = null;
        break;
      case READ_CHAT_SUCCESS: {
        draft.readChatLoading = false;
        draft.readChatDone = true;
        draft.chatMessages = draft.chatMessages.concat(action.data);
        break;
      }
      case READ_CHAT_FAILURE:
        draft.readChatLoading = false;
        draft.readChatError = action.error;
        break;

      default:
        return;
    }
  });
};
export default post;
