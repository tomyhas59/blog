const express = require("express");
const { User, Post } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const UserService = require("../service/user");

router.post("/signup", isNotLoggedIn, UserService.signUp);
router.get("/", UserService.main);
router.post("/login", UserService.logIn);
router.post("/logout", isLoggedIn, UserService.logOut);

//----------------------------------------------------------------------

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.get("/followers", isLoggedIn, async (req, res, next) => {
  //GET/user/followers
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(403).send("사람이 없습니다.");
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });

    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("사람이 없습니다.");
    }

    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });

    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send("사람이 없습니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    // DELETE /user/1/follow
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send("사람이 없습니다");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.delete("/follwer/:userId", isLoggedIn, async (req, res, next) => {
  try {
    // DELETE /user/follower/2
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send("사람이 없습니다");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.get("/:userId/posts", async (req, res, next) => {
  // = GET /user/1/posts
  try {
    const where = { UserId: req.params.userId }; //params = 상대의 아이디 찾을 때
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    } //id가 lastId보다 작은 걸로 llimit개 불러와라
    const posts = await Post.findAll({
      where,
      limit: 10,
      //  offset: 0, //0~10  0에서 limit 만큼 가져와라
      include: [
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User,
          through: "Like",
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]], //DESC 내림차순 ASC 오름차순
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//----------------------------------------------------------------------

router.get("/:userId", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.params.id },
        //attributes : ["id", "nickname", "email"], <- 이것만 가져오겠다
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      if (fullUserWithoutPassword) {
        const data = fullUserWithoutPassword.toJSON();
        data.Posts = data.Posts.length; //개인 정보 침해 예방
        data.Followers = data.Followers.length;
        data.Followings = data.Followings.length;
      }
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
