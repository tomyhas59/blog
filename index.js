const express = require("express");
const app = express();
const morgan = require("morgan");
app.set("port", 3075);
const path = require("path");

app.use(morgan("combined"));
//로그를 찍어줌
//종류 dev(개발용), combined(배포용), common, short, tiny
app.use(express.json()); //json req.body 데이터 읽는 것 허용
app.use(express.urlencoded({ extended: false }));
//url에 있는 정보를 express 내에 있는 해석툴로 읽을 것이냐
// extended: false (nodeJS에 내장된 qureystring 모듈로 해석)
// extended: true (추가로 설치하여 외부 해석툴 qs로 해석)
app.use("/", express.static(path.join(__dirname, "public")));

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번으로 서버 실행 중`);
});
