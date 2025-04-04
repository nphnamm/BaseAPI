"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Roles", [
      {
        id: "3dd54a71-c0f5-4142-a1ff-ec9b08e91dbb",
        name: "Admin",
        description: "Administrator with full access",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "874f51b7-87f6-426d-bc0f-01344748a52a",
        name: "User",
        description: "Regular user with limited access",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "d4c909f2-f9ff-42ce-8d31-336bd8a4ca07",
        name: "Moderator",
        description: "Moderator with permissions to manage content",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
