const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: "포스트",
        },
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글, 이모티콘 저장
        timestamps: true, //updateAt, createAt 생성
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: "userIdx" } /*컬럼명 */);
    db.Post.hasMany(db.Comment); //hasMany 관계로 인해 s가 붙어서 post.Comments 이런 식으로 제공
  }
};
