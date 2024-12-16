import { produce } from "immer";
import { Message, PostType } from "../types";

//전역 상태 초기값
const initialState = {
  posts: [] as PostType[],
  post: {} as PostType,
  totalPosts: null,
  imagePaths: [] as string[],
  searchedPosts: [] as PostType[],
  searchOption: "",
  totalSearchedPosts: null,
  chatMessages: [] as Message[],

  getPostsLoading: false,
  getPostsDone: false,
  getPostsError: null,

  getPostLoading: false,
  getPostDone: false,
  getPostError: null,

  searchedPostsLoading: false,
  searchedPostsDone: false,
  searchedPostsError: null,

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
export const GET_POSTS_REQUEST = "ALL_POSTS_REQUEST";
export const GET_POSTS_SUCCESS = "ALL_POSTS_SUCCESS";
export const GET_POSTS_FAILURE = "ALL_POSTS_FAILURE";

export const GET_POST_REQUEST = "ALL_POST_REQUEST";
export const GET_POST_SUCCESS = "ALL_POST_SUCCESS";
export const GET_POST_FAILURE = "ALL_POST_FAILURE";

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
      //------------------------------------------------------
      case GET_POSTS_REQUEST:
        draft.getPostsLoading = true;
        draft.getPostsDone = false;
        draft.getPostsError = null;
        break;
      case GET_POSTS_SUCCESS:
        draft.getPostsLoading = false;
        draft.getPostsDone = true;
        draft.posts = action.data;
        draft.totalPosts = action.totalPosts;
        break;
      case GET_POSTS_FAILURE:
        draft.getPostsLoading = false;
        draft.getPostsError = action.error;
        break;
      //------------------------------------------------------
      case GET_POST_REQUEST:
        draft.getPostLoading = true;
        draft.getPostDone = false;
        draft.getPostError = null;
        break;
      case GET_POST_SUCCESS:
        draft.getPostLoading = false;
        draft.post = action.data;
        draft.getPostDone = true;
        break;
      case GET_POST_FAILURE:
        draft.getPostLoading = false;
        draft.getPostError = action.error;
        break;
      //------------------------------------------------------
      case SEARCH_POSTS_REQUEST:
        draft.searchedPostsLoading = true;
        draft.searchedPostsDone = false;
        draft.searchedPosts = [];
        draft.searchedPostsError = null;
        break;
      case SEARCH_POSTS_SUCCESS:
        draft.searchedPostsLoading = false;
        draft.searchedPostsDone = true;
        draft.searchedPosts = action.searchedPosts;
        draft.totalSearchedPosts = action.totalSearchedPosts;
        draft.searchOption = action.searchOption;
        break;
      case SEARCH_POSTS_FAILURE:
        draft.searchedPostsLoading = false;
        draft.searchedPostsError = action.error;
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
        draft.posts.unshift(action.data);
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
          (imagePath) => imagePath !== action.data.filename
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

        draft.post.Images = draft.post.Images.filter(
          (post) => post.src !== action.data.filename
        );

        draft.deleteImageDone = true;
        break;
      }
      case DELETE_IMAGE_FAILURE:
        draft.deleteImageLoading = false;
        draft.deleteImageError = action.error;
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
        draft.posts = draft.posts.filter(
          (post) => post.id !== action.data.PostId
        );
        //search
        draft.searchedPosts = draft.searchedPosts.filter(
          (post) => post.id !== action.data.PostId
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
        draft.post = action.data.updatePost;
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
        draft.post.Comments.push(action.data);
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
        draft.post.Comments = draft.post.Comments.filter(
          (post: { id: any }) => post.id !== action.data.CommentId
        );
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
        const commentIndex = draft.post.Comments.findIndex(
          (post: { id: any }) => post.id === action.data.CommentId
        );
        draft.post.Comments[commentIndex].content = action.data.content;
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

        const commentIndex = draft.post.Comments.findIndex(
          (post: { id: any }) => post.id === action.data.CommentId
        );
        draft.post.Comments[commentIndex].ReComments.push(action.data);

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

        const commentIndex = draft.post.Comments.findIndex(
          (post: { id: any }) => post.id === action.data.CommentId
        );
        draft.post.Comments[commentIndex].ReComments = draft.post.Comments[
          commentIndex
        ].ReComments.filter(
          (post: { id: any }) => post.id !== action.data.ReCommentId
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

        const commentIndex = draft.post.Comments.findIndex(
          (post: { id: any }) => post.id === action.data.CommentId
        );
        const reCommentIndex = draft.post.Comments[
          commentIndex
        ].ReComments.findIndex(
          (post: { id: any }) => post.id === action.data.ReCommentId
        );
        draft.post.Comments[commentIndex].ReComments[reCommentIndex].content =
          action.data.content;

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
        draft.post.Likers.push({
          id: action.data.UserId,
          nickname: action.data.nickname,
        });

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
        draft.post.Likers = draft.post.Likers.filter(
          (post: { id: any }) => post.id !== action.data.UserId
        );
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
