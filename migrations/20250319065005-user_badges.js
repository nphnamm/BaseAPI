'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserBadges', {
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
      badgeId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: false,
        references: {
          model: "Badges",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      earnedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('UserBadges');

  }
};
