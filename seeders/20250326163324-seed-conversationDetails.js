'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('conversationDetails', [
      {
        id: 'f49186a8-c5df-4a1b-8b08-7968a1b31234',
        conversationId: 'f49186a8-c5df-4a1b-8b08-7968a1b3d999',
        message: 'Hello, how can you help me today?',
        response: 'Hello! I\'m here to assist you with any questions or tasks you might have.',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f49186a8-c5df-4a1b-8b08-7968a1b31235',
        conversationId: 'f49186a8-c5df-4a1b-8b08-7968a1b3d999',
        message: 'Can you help me with coding?',
        response: 'Of course! I can help you with programming, debugging, and explaining code concepts. What specific help do you need?',
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f49186a8-c5df-4a1b-8b08-7968a1b31236',
        conversationId: 'f49186a8-c5df-4a1b-8b08-7968a1b3d888',
        message: 'Hello, how can you help me today?',
        response: 'Hello! I\'m here to assist you with any questions or tasks you might have.',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f49186a8-c5df-4a1b-8b08-7968a1b31237',
        conversationId: 'f49186a8-c5df-4a1b-8b08-7968a1b3d888',
        message: 'Can you help me with coding?',
        response: 'Of course! I can help you with programming, debugging, and explaining code concepts. What specific help do you need?',
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conversationDetails', null, {});
  }
};
