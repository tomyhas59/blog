import { produce } from "immer";
import { UserType } from "../types";
export const initialState = {
  isLoggedIn: false,

  logInLoading: false,
  logInDone: false,
  logInError: null,

  logOutLoading: false,
  logOutDone: false,
  logOutError: null,

  signUpLoading: false,
  signUpDone: false,
  signUpError: null,

  refreshTokenLoading: false,
  refreshTokenDone: false,
  refreshTokenError: null,

  followLoading: false,
  followDone: false,
  followError: null,

  removeFollowerLoading: false,
  removeFollowerDone: false,
  removeFollowerError: null,

  unFollowLoading: false,
  unFollowDone: false,
  unFollowError: null,

  me: null as UserType | null,
};

export const LOG_IN_FAILURE = "LOG_IN_FAILURE";
export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";

export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";
export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";

export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";

export const REFRESH_TOKEN_FAILURE = "REFRESH_TOKEN_FAILURE";
export const REFRESH_TOKEN_REQUEST = "REFRESH_TOKEN_REQUEST";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";

export const FOLLOW_FAILURE = "FOLLOW_FAILURE";
export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";

export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";
export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";

interface Action<T = any> {
  type: string;
  data?: T;
  error?: any;
}

const user = (state = initialState, action: Action) => {
  return produce(state, (draft) => {
    /*draft 안에 불변성이 지켜진 채로 존재*/
    switch (action.type) {
      //------------------------------------------
      case LOG_IN_REQUEST:
        draft.logInError = null;
        draft.logInLoading = true;
        draft.logInDone = false;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = action.data;
        draft.isLoggedIn = true;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error; //saga failure의 put부분의 error 실행
        break;
      //------------------------------------------
      case LOG_OUT_REQUEST:
        draft.logOutError = null;
        draft.logOutLoading = true;
        draft.logOutDone = false;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.isLoggedIn = false;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      //------------------------------------------
      case SIGN_UP_REQUEST:
        draft.signUpError = null;
        draft.signUpLoading = true;
        draft.signUpDone = false;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      //--------------------------------------------
      case REFRESH_TOKEN_REQUEST:
        draft.refreshTokenError = null;
        draft.refreshTokenLoading = true;
        draft.refreshTokenDone = false;
        break;
      case REFRESH_TOKEN_SUCCESS:
        draft.refreshTokenLoading = false;
        draft.refreshTokenDone = true;
        draft.me = action.data;
        draft.isLoggedIn = true;
        break;
      case REFRESH_TOKEN_FAILURE:
        draft.refreshTokenLoading = false;
        draft.refreshTokenError = action.error;
        break;
      //--------------------------------------------
      case FOLLOW_REQUEST:
        draft.followError = null;
        draft.followLoading = true;
        draft.followDone = false;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me!.Followings.push({
          id: action.data.UserId,
          nickname: action.data.Nickname,
        });
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;

      //--------------------------------------------
      case UNFOLLOW_REQUEST:
        draft.unFollowError = null;
        draft.unFollowLoading = true;
        draft.unFollowDone = false;
        break;
      case UNFOLLOW_SUCCESS: {
        draft.unFollowLoading = false;
        draft.unFollowDone = true;
        if (draft.me?.Followings) {
          draft.me.Followings = draft.me.Followings.filter(
            (v) => v.id !== action.data.UserId
          );
        }
        break;
      }
      case UNFOLLOW_FAILURE:
        draft.unFollowLoading = false;
        draft.unFollowError = action.error;
        break;
      //----------------------------------------------
      case "SET_USER_IMAGE":
        if (draft.me) {
          draft.me.Image = action.data;
        }
        break;
      case "DELETE_USER_IMAGE":
        if (draft.me) {
          draft.me.Image = action.data;
        }
        break;
      case "SET_USER":
        draft.me = action.data;
        draft.isLoggedIn = true;
        break;
      case "INITIALIZE_STATE":
        return initialState; // 초기 상태로 리셋
    }
  });
};
export default user;
