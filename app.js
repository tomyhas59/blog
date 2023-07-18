const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const db = require("./models");
const passportConfig = require("./passport");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser"); //middleware
const morgan = require("morgan"); //middleware
const path = require("path");

dotenv.config();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
passportConfig();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //쿠키 보내는 코드
  })
);
app.use(
  "/",
  /*localhost:3075/와 같다*/ express.static(path.join(__dirname, "uploads"))
);
app.use(morgan("dev"));
app.use(express.json()); //req.body의 데이터를 보내는 역할
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

app.listen(3075, () => {
  console.log("서버 실행중");
});
