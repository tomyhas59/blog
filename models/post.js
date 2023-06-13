const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: { type: DataTypes.TEXT, allowNull: false }, //RetweetId
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글, 이모티콘 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User); //테이블에 UserId 컬럼 생김
    db.Post.belongsToMany(db.Hashtag, { through: "postHashtag" }); // 다 대 다 관계
    db.Post.hasMany(db.Comment); //post.addComments 이런식으로 제공
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
    db.Post.belongsTo(db.Post, { as: "Retweet" }); //RetweetId 컬럼 생성

    //db.Post.hasOne(db.PostInfo) 일 대 일 관계
  }
};
