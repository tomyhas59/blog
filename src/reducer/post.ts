import { produce } from "immer";
import { CommentType, MessageType, PostType } from "../types";

//전역 상태 초기값
const initialState = {
  //post
  posts: [] as PostType[],
  totalPostsCount: null,
  post: {} as PostType,
  //comment
  comments: [] as CommentType[],
  totalCommentsCount: null,
  commentsCount: null,
  top3Comments: [] as CommentType[],
  //searchedPosts
  searchedPosts: [] as PostType[],
  searchOption: "",
  totalSearchedPostsCount: null,
  //hashtagPosts
  hashtagPosts: [] as PostType[],
  totalHashtagPostsCount: null,
  chatMessages: [] as MessageType[],

  //id
  postNum: null,
  commentNum: null,
  newCommentId: null, //댓글 등록 후 해당 댓글 id
  //darkMode
  isDarkMode: localStorage.getItem("darkMode") === "enabled",

  getPostsLoading: false,
  getPostsDone: false,
  getPostsError: null,

  getCommentsLoading: false,
  getCommentsDone: false,
  getCommentsError: null,

  getPostLoading: false,
  getPostDone: false,
  getPostError: null,

  searchedPostsLoading: false,
  searchedPostsDone: false,
  searchedPostsError: null,

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

  addReplyLoading: false,
  addReplyDone: false,
  addReplyError: null,

  removeReplyLoading: false,
  removeReplyDone: false,
  removeReplyError: null,

  updateReplyLoading: false,
  updateReplyDone: false,
  updateReplyError: null,

  likePostLoading: false,
  likePostDone: false,
  likePostError: null,

  unLikePostLoading: false,
  unLikePostDone: false,
  unLikePostError: null,

  likeCommentLoading: false,
  likeCommentDone: false,
  likeCommentError: null,

  unLikeCommentLoading: false,
  unLikeCommentDone: false,
  unLikeCommentError: null,

  likeReplyLoading: false,
  likeReplyDone: false,
  likeReplyError: null,

  unLikeReplyLoading: false,
  unLikeReplyDone: false,
  unLikeReplyError: null,

  readChatLoading: false,
  readChatDone: false,
  readChatError: null,

  getHashtagPostsLoading: false,
  getHashtagPostsDone: false,
  getHashtagPostsError: null,
};

//action명
export const GET_POSTS_REQUEST = "GET_POSTS_REQUEST";
export const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS";
export const GET_POSTS_FAILURE = "GET_POSTS_FAILURE";

export const GET_COMMENTS_REQUEST = "GET_COMMENTS_REQUEST";
export const GET_COMMENTS_SUCCESS = "GET_COMMENTS_SUCCESS";
export const GET_COMMENTS_FAILURE = "GET_COMMENTS_FAILURE";

export const GET_POST_REQUEST = "GET_POST_REQUEST";
export const GET_POST_SUCCESS = "GET_POST_SUCCESS";
export const GET_POST_FAILURE = "GET_POST_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

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

export const ADD_REPLY_REQUEST = "ADD_REPLY_REQUEST";
export const ADD_REPLY_SUCCESS = "ADD_REPLY_SUCCESS";
export const ADD_REPLY_FAILURE = "ADD_REPLY_FAILURE";

export const REMOVE_REPLY_REQUEST = "REMOVE_REPLY_REQUEST";
export const REMOVE_REPLY_SUCCESS = "REMOVE_REPLY_SUCCESS";
export const REMOVE_REPLY_FAILURE = "REMOVE_REPLY_FAILURE";

export const UPDATE_REPLY_REQUEST = "UPDATE_REPLY_REQUEST";
export const UPDATE_REPLY_SUCCESS = "UPDATE_REPLY_SUCCESS";
export const UPDATE_REPLY_FAILURE = "UPDATE_REPLY_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LIKE_COMMENT_REQUEST = "LIKE_COMMENT_REQUEST";
export const LIKE_COMMENT_SUCCESS = "LIKE_COMMENT_SUCCESS";
export const LIKE_COMMENT_FAILURE = "LIKE_COMMENT_FAILURE";

export const UNLIKE_COMMENT_REQUEST = "UNLIKE_COMMENT_REQUEST";
export const UNLIKE_COMMENT_SUCCESS = "UNLIKE_COMMENT_SUCCESS";
export const UNLIKE_COMMENT_FAILURE = "UNLIKE_COMMENT_FAILURE";

export const LIKE_REPLY_REQUEST = "LIKE_REPLY_REQUEST";
export const LIKE_REPLY_SUCCESS = "LIKE_REPLY_SUCCESS";
export const LIKE_REPLY_FAILURE = "LIKE_REPLY_FAILURE";

export const UNLIKE_REPLY_REQUEST = "UNLIKE_REPLY_REQUEST";
export const UNLIKE_REPLY_SUCCESS = "UNLIKE_REPLY_SUCCESS";
export const UNLIKE_REPLY_FAILURE = "UNLIKE_REPLY_FAILURE";

export const SEARCH_POSTS_REQUEST = "SEARCH_POSTS_REQUEST";
export const SEARCH_POSTS_SUCCESS = "SEARCH_POSTS_SUCCESS";
export const SEARCH_POSTS_FAILURE = "SEARCH_POSTS_FAILURE";

export const READ_CHAT_REQUEST = "READ_CHAT_REQUEST";
export const READ_CHAT_SUCCESS = "READ_CHAT_SUCCESS";
export const READ_CHAT_FAILURE = "READ_CHAT_FAILURE";

export const DELETE_ALL_CHAT_REQUEST = "DELETE_ALL_CHAT_REQUEST";
export const DELETE_ALL_CHAT_SUCCESS = "DELETE_ALL_CHAT_SUCCESS";
export const DELETE_ALL_CHAT_FAILURE = "DELETE_ALL_CHAT_FAILURE";

export const GET_HASHTAG_POSTS_REQUEST = "GET_HASHTAG_POSTS_REQUEST";
export const GET_HASHTAG_POSTS_SUCCESS = "GET_HASHTAG_POSTS_SUCCESS";
export const GET_HASHTAG_POSTS_FAILURE = "GET_HASHTAG_POSTS_FAILURE";

const post = (state = initialState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "REFRESH":
        return initialState;
      case "RESET_CHAT_MESSAGES":
        draft.chatMessages = [];
        break;
      case "RESET_NUM":
        draft.postNum = null;
        draft.commentNum = null;
        break;
      case "TOGGLE_DARK_MODE":
        draft.isDarkMode = !draft.isDarkMode;
        localStorage.setItem(
          "darkMode",
          draft.isDarkMode ? "enabled" : "disabled"
        );
        break;
      case "SET_MODE":
        draft.isDarkMode = action.data;
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
        draft.totalPostsCount = action.totalPostsCount;
        break;
      case GET_POSTS_FAILURE:
        draft.getPostsLoading = false;
        draft.getPostsError = action.error;
        break;
      //---------------------------------------------------
      case GET_COMMENTS_REQUEST:
        draft.getCommentsLoading = true;
        draft.getCommentsDone = false;
        draft.getCommentsError = null;
        break;
      case GET_COMMENTS_SUCCESS:
        draft.getCommentsLoading = false;
        draft.getCommentsDone = true;
        draft.comments = action.data;
        draft.totalCommentsCount = action.totalCommentsCount;
        draft.commentsCount = action.commentsCount;
        draft.top3Comments = action.top3Comments;
        break;
      case GET_COMMENTS_FAILURE:
        draft.getCommentsLoading = false;
        draft.getCommentsError = action.error;
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
        draft.totalSearchedPostsCount = action.totalSearchedPostsCount;
        draft.searchOption = action.searchOption;
        draft.postNum = action.postNum;
        draft.commentNum = action.commentNum;
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

        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
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
        draft.post = action.data.updatedPost;
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
        draft.comments.push(action.data);
        draft.newCommentId = action.data.id;
        if (draft.totalCommentsCount) draft.totalCommentsCount++;

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
        draft.comments = draft.comments.filter(
          (comment: { id: any }) => comment.id !== action.data.CommentId
        );
        if (draft.totalCommentsCount) draft.totalCommentsCount--;
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
        const commentIndex = draft.comments.findIndex(
          (comment: { id: any }) => comment.id === action.data.CommentId
        );
        draft.comments[commentIndex].content = action.data.content;
        break;
      }

      case UPDATE_COMMENT_FAILURE:
        draft.updateCommentLoading = false;
        draft.updateCommentError = action.error;
        break;
      //-----------------------------------------------------

      case ADD_REPLY_REQUEST:
        draft.addReplyLoading = true;
        draft.addReplyDone = false;
        draft.addReplyError = null;
        break;
      case ADD_REPLY_SUCCESS: {
        draft.addReplyLoading = false;
        draft.addReplyDone = true;

        const commentIndex = draft.comments.findIndex(
          (post: { id: any }) => post.id === action.data.CommentId
        );
        draft.comments[commentIndex].Replies.push(action.data);
        if (draft.totalCommentsCount) draft.totalCommentsCount++;
        break;
      }
      case ADD_REPLY_FAILURE:
        draft.addReplyLoading = false;
        draft.addReplyError = action.error;
        break;
      //-----------------------------------------------------

      case REMOVE_REPLY_REQUEST:
        draft.removeReplyLoading = true;
        draft.removeReplyDone = false;
        draft.removeReplyError = null;
        break;
      case REMOVE_REPLY_SUCCESS: {
        draft.removeReplyLoading = false;
        draft.removeReplyDone = true;

        const commentIndex = draft.comments.findIndex(
          (comment: { id: any }) => comment.id === action.data.CommentId
        );
        draft.comments[commentIndex].Replies = draft.comments[
          commentIndex
        ].Replies.filter(
          (post: { id: any }) => post.id !== action.data.ReplyId
        );
        if (draft.totalCommentsCount) draft.totalCommentsCount--;
        break;
      }
      case REMOVE_REPLY_FAILURE:
        draft.removeReplyLoading = false;
        draft.removeReplyError = action.error;
        break;
      //---------------------------------------------------

      case UPDATE_REPLY_REQUEST:
        draft.updateReplyLoading = true;
        draft.updateReplyDone = false;
        draft.updateReplyError = null;
        break;
      case UPDATE_REPLY_SUCCESS: {
        draft.updateReplyLoading = false;
        draft.updateReplyDone = true;

        const commentIndex = draft.comments.findIndex(
          (comment: { id: any }) => comment.id === action.data.CommentId
        );
        const replyIndex = draft.comments[commentIndex].Replies.findIndex(
          (reply: { id: any }) => reply.id === action.data.ReplyId
        );
        draft.comments[commentIndex].Replies[replyIndex].content =
          action.data.content;

        break;
      }

      case UPDATE_REPLY_FAILURE:
        draft.updateReplyLoading = false;
        draft.updateReplyError = action.error;
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
          (liker: { id: any }) => liker.id !== action.data.UserId
        );
        draft.unLikePostLoading = false;
        draft.unLikePostDone = true;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unLikePostLoading = false;
        draft.unLikePostError = action.error;
        break;
      //-------------------------------------------------------------------

      case LIKE_COMMENT_REQUEST:
        draft.likeCommentLoading = true;
        draft.likeCommentDone = false;
        draft.likeCommentError = null;
        break;
      case LIKE_COMMENT_SUCCESS: {
        const commentIndex = draft.comments.findIndex(
          (comment) => comment.id === action.data.CommentId
        );

        if (commentIndex === -1) {
          return;
        }

        if (!draft.comments[commentIndex].Likers) {
          draft.comments[commentIndex].Likers = [];
        }

        draft.comments[commentIndex].Likers.push({
          id: action.data.UserId,
          nickname: action.data.nickname,
        });

        //top3 Comments UI
        if (action.isTop3Comments) {
          const topCommentIndex = draft.top3Comments.findIndex(
            (comment) => comment.id === action.data.CommentId
          );
          if (topCommentIndex === -1) {
            return;
          }
          draft.top3Comments[topCommentIndex].Likers.push({
            id: action.data.UserId,
            nickname: action.data.nickname,
          });
        }
        draft.likeCommentLoading = false;
        draft.likeCommentDone = true;
        break;
      }
      case LIKE_COMMENT_FAILURE:
        draft.likeCommentLoading = false;
        draft.likeCommentError = action.error;
        break;
      //-------------------------------------------------------------------

      case UNLIKE_COMMENT_REQUEST:
        draft.unLikeCommentLoading = true;
        draft.unLikeCommentDone = false;
        draft.unLikeCommentError = null;
        break;
      case UNLIKE_COMMENT_SUCCESS: {
        const commentIndex = draft.comments.findIndex(
          (comment) => comment.id === action.data.CommentId
        );
        if (commentIndex === -1) {
          return;
        }

        draft.comments[commentIndex].Likers = draft.comments[
          commentIndex
        ].Likers.filter(
          (liker: { id: any }) => liker.id !== action.data.UserId
        );
        //top3 Comments UI
        if (action.isTop3Comments) {
          const topCommentIndex = draft.top3Comments.findIndex(
            (comment) => comment.id === action.data.CommentId
          );
          if (topCommentIndex === -1) {
            return;
          }
          draft.top3Comments[topCommentIndex].Likers = draft.top3Comments[
            topCommentIndex
          ].Likers.filter(
            (liker: { id: any }) => liker.id !== action.data.UserId
          );
        }
        draft.unLikeCommentLoading = false;
        draft.unLikeCommentDone = true;
        break;
      }
      case UNLIKE_COMMENT_FAILURE:
        draft.unLikeCommentLoading = false;
        draft.unLikeCommentError = action.error;
        break;

      //-------------------------------------------------------------------

      case LIKE_REPLY_REQUEST:
        draft.likeReplyLoading = true;
        draft.likeReplyDone = false;
        draft.likeReplyError = null;
        break;
      case LIKE_REPLY_SUCCESS: {
        const commentIndex = draft.comments.findIndex(
          (comment: { id: any }) => comment.id === action.data.CommentId
        );

        if (commentIndex === -1) return;

        const replyIndex = draft.comments[commentIndex].Replies.findIndex(
          (reply: { id: any }) => reply.id === action.data.ReplyId
        );

        if (replyIndex === -1) return;

        if (!draft.comments[commentIndex].Replies[replyIndex].Likers) {
          draft.comments[commentIndex].Replies[replyIndex].Likers = [];
        }

        draft.comments[commentIndex].Replies[replyIndex].Likers.push({
          id: action.data.UserId,
          nickname: action.data.nickname,
        });

        draft.likeReplyLoading = false;
        draft.likeReplyDone = true;
        break;
      }
      case LIKE_REPLY_FAILURE:
        draft.likeReplyLoading = false;
        draft.likeReplyError = action.error;
        break;
      //-------------------------------------------------------------------

      case UNLIKE_REPLY_REQUEST:
        draft.unLikeReplyLoading = true;
        draft.unLikeReplyDone = false;
        draft.unLikeReplyError = null;
        break;
      case UNLIKE_REPLY_SUCCESS: {
        const commentIndex = draft.comments.findIndex(
          (comment: { id: any }) => comment.id === action.data.CommentId
        );

        if (commentIndex === -1) return;

        const replyIndex = draft.comments[commentIndex].Replies.findIndex(
          (reply: { id: any }) => reply.id === action.data.ReplyId
        );

        if (replyIndex === -1) return;
        draft.comments[commentIndex].Replies[replyIndex].Likers =
          draft.comments[commentIndex].Replies[replyIndex].Likers.filter(
            (liker: { id: any }) => liker.id !== action.data.UserId
          );

        draft.unLikeReplyLoading = false;
        draft.unLikeReplyDone = true;
        break;
      }
      case UNLIKE_REPLY_FAILURE:
        draft.unLikeReplyLoading = false;
        draft.unLikeReplyError = action.error;
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

      //-------------------------------------------------------
      case GET_HASHTAG_POSTS_REQUEST:
        draft.getHashtagPostsLoading = true;
        draft.getHashtagPostsDone = false;
        draft.getHashtagPostsError = null;
        break;
      case GET_HASHTAG_POSTS_SUCCESS: {
        draft.getHashtagPostsLoading = false;
        draft.getHashtagPostsDone = true;
        draft.hashtagPosts = action.data.hashtagPosts;
        draft.totalHashtagPostsCount = action.data.totalHashtagPostsCount;
        break;
      }
      case GET_HASHTAG_POSTS_FAILURE:
        draft.getHashtagPostsLoading = false;
        draft.getHashtagPostsError = action.error;
        break;

      default:
        return;
    }
  });
};
export default post;
