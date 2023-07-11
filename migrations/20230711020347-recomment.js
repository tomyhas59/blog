"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("recomments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "리코멘트",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};

// await queryInterface.createTable("테이블명", 컬럼명: {type: Sequelize.TEXT, ....})
// await queryInterface.dropTable('테이블명')
// await queryInterface.addColumn("테이블명", "추가하는 컬럼명",  {type: Sequelize.TEXT, ....})
// await queryInterface.removeColumn("테이블명", "제거하는 컬럼 명")
// await queryInterface.renameColumn("테이블명", "컬럼 이름 변경 전" , "컬럼 이름 변경 후" )
// await queryInterface.changeColumn("테이블명", "컬럼명",  {type: Sequelize.TEXT, ....})

//npx sequelize db:migrate 
//npx sequelize db:migrate:undo