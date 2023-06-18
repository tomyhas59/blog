const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        //id는 기본 제공
        email: {
          type: Sequelize.STRING(30), //STRING, TEXT, BOOLEAN, INTEGER(정수), FLOAT(실수) , DATETIME
          allowNull: false, //필수인지 아닌지 false면 필수
          unique: true, //고유한 값
          comment: "이메일",
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false, //필수인지 아닌지 false면 필수
          comment: "비밀번호",
        },
      },
      {
        modelName: "User",
        tableName: "users",
        timestamps: true, //updateAt, createAt 생성
        charset: "utf8",
        collate: "utf8_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post), { as: "Posts" };
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); //중간 테이블 이름
    db.User.belongsToMany(db.User, {
      through: "Follow", //중간 테이블 이름
      as: "Followers", //테이블 별칭
      foreignKey: "FollowingsId", //column 이름
    });
    db.User.belongsToMany(db.User, {
      through: "Follow", //중간 테이블 이름
      as: "Followings", //테이블 별칭
      foreignKey: "FollowersId", //column 이름
    });
  }
};
