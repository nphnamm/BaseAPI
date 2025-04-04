'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("UserProgresses", {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        primaryKey: true,
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: false,
        references: {
          model: "UserSessions",
          key: "id",
        },
      },
      cardId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: false,
        references: {
          model: "Cards",
          key: "id",
        },
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      timesAnswered: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      answeredAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("UserProgresses");

  }
};
