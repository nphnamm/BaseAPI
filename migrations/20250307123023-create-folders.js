"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Folders", {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        defaultValue: Sequelize.UUIDV4, // Automatically generate UUIDs
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: false,
        references: {
          model: "Users", // Ensure it matches the "Users" table
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable("Folders");
  },
};
