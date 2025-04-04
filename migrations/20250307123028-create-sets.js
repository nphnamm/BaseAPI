"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Sets", {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        defaultValue: Sequelize.UUIDV4, // Auto-generate UUID
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      folderId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: true,
        references: {
          model: "Folders",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false, // Set to false if every Set must belong to a user
        references: {
          model: "Users", // Assuming you have a Users table
          key: "id",
        },
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isDraft: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      cardCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1, // Default to "active" status (status ID 1)
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Sets");
  },
};
