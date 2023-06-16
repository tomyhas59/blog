const postRouter = require("./routes/post");;
const userRouter = require("./routes/user");
const express = require("express");
const app = express();
const morgan = require("morgan");
app.set("port", 3075);
const path = require("path");
//------------------------------------------------------------
const db = require("./models");
const dotenv = require("dotenv");

dotenv.config();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
//------------------------------------------------------------

app.use(
  morgan("dev"), //로그를 찍어줌 ,종류 dev(개발용), combined(배포용), common, short, tiny
  express.json(), //json req.body 데이터 읽는 것 허용
  express.urlencoded({ extended: false }) //url에 있는 정보를 express 내에 있는 해석툴로 읽을 것이냐
  // extended: false (nodeJS에 내장된 qureystring 모듈로 해석)
  // extended: true (추가로 설치하여 외부 해석툴 qs로 해석)
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번으로 서버 실행 중`);
});
