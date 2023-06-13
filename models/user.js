const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        //id는 기본 제공
        email: {
          type: DataTypes.STRING(30), //STRING, TEXT, BOOLEAN, INTEGER(정수), FLOAT(실수) , DATETIME
          allowNull: false, //필수인지 아닌지 false면 필수
          unique: true, //고유한 값
          comment: "이메일",
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false, //필수인지 아닌지 false면 필수
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false, //필수인지 아닌지 false면 필수
        },
      },
      {
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post), { as: "Posts" };
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); //중간 테이블 이름
    db.User.belongsToMany(db.User, {
      through: "Follow", //중간 테이블 이름
      as: "Followers",
      foreignKey: "FollowingsId", //column 이름 바꾸는 느낌
    });
    db.User.belongsToMany(db.User, {
      through: "Follow", //중간 테이블 이름
      as: "Followings",
      foreignKey: "FollowersId",
    });
  }
};
