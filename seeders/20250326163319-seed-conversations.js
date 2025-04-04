'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('conversations', [
      {
        id:"f49186a8-c5df-4a1b-8b08-7968a1b3d999",
        userId: '82d7fb57-9190-43d2-b501-606222e37228',
        title: "Conversation 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "f49186a8-c5df-4a1b-8b08-7968a1b3d888",
        userId: 'f49186a8-c5df-4a1b-8b08-7968a1b3d372',
        title: "Conversation 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
  
  }
};
