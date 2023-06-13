import { produce } from "immer";

export const initialState = {
  isLoading: false,
  isDone: false,
  isError: null,

  logInLoading: false,
  logInDone: false,
  logInError: null,

  logOutLoading: false,
  logOutDone: false,
  logOutError: null,

  signUpLoading: false,
  signUpDone: false,
  signUpError: null,

  me: null,
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

const user = (state = initialState, action) => {
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
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.err;
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
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.err;
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
        draft.signUpError = action.err;
        break;
      default:
        return console.log("오류가 났습니다");
    }
  });
};

export default user;
