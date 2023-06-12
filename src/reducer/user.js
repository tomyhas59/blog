import {produce} from "immer";

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

const rootReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    /*draft 안에 불변성이 지켜진 채로 존재*/
    switch (action.type) {
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
      default:
        return console.log("오류가 났습니다");
    }
  });
};

export default rootReducer;
