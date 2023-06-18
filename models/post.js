const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: "콘텐츠",
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
  static associate(db) {}
};
