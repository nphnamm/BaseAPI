'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserStats', {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Auto-generate UUID
      },
      userId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      currentXP: {
        type: Sequelize.INTEGER,  
        allowNull: false,
        defaultValue: 0,
      },
      requiredXP: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      streak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastStreakDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      coins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserStats');

  }
};
