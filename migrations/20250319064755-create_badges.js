'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Badges', {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Auto-generate UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requirement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      xpReward: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      coinReward: {
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
    await queryInterface.dropTable("Badges");
  }
}

