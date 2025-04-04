"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Cards", {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        defaultValue: Sequelize.UUIDV4, // Auto-generate UUID
        primaryKey: true,
      },
      term: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      definition: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      setId: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        allowNull: false,
        references: {
          model: "Sets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      position: {
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
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Cards");
  },
};
