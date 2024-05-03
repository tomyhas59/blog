import { all, fork } from "redux-saga/effects";
import axios from "axios";
import postSaga from "./post";
import userSaga from "./user";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:8000"
    : "http://localhost:3075";
axios.defaults.withCredentials = true;
//백에서 쿠키 받음,
//app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true, //쿠키 보내는 코드, 프론트의 saga/index에서 axios.defaults.withCredentials = true 해줘야 쿠키 받음
//   })
// );

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
