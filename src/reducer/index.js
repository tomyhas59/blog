import { combineReducers } from "redux";
import todo from "./todo";
import post from "./post";
const rootReducer = combineReducers({
  todo,
  post,
});

export default rootReducer;
