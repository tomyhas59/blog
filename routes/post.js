const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const PostService = require("../service/post");

router.post("/", isLoggedIn, PostService.create);
router.put("/", isLoggedIn, PostService.update);
router.get("/all", PostService.readAll);
router.get("/:postId", PostService.read);
router.delete("/:postId", isLoggedIn, PostService.delete);

module.exports = router;

//"https://Localhost:3000/post?idx=3000" => req.qurey.idx = 3000;
//"https://Localhost:3000/post/35" => req.params.postId = 35
