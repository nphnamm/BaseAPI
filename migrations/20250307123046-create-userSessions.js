"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserSessions", {
      id: {
        type: Sequelize.UUID, // Change from INTEGER to UUID
        defaultValue: Sequelize.UUIDV4, // Auto-generate UUID
        primaryKey: true,
        allowNull: false,
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
      sessionType: {
        type: Sequelize.ENUM(
          "write",
          "multi-choice",
          "fill-in",
          "drag-and-drop",
          "true-false",
          "matching",
          "flashcard",
          "test"
        ),
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
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserSessions");
  },
};
