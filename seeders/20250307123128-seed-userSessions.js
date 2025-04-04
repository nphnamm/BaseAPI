"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("UserSessions", [
      {
        id: "2513474f-e8d9-452f-ac14-1357b815f8e0", // UUID tự động tạo
        userId: "82d7fb57-9190-43d2-b501-606222e37228", // Mock User UUID
        setId: "0b8de8f4-d79a-476f-9abd-1cec12d0b5af", // Mock Set UUID
        sessionType: "multi-choice",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "165d5d76-5c27-4524-a2b9-0b5a3d3c941a", // UUID tự động tạo
        userId: "82d7fb57-9190-43d2-b501-606222e37228",
        setId: "9e90549d-00bf-4740-9041-997a5129d93f",
        sessionType: "write",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "165d5d76-5c27-4524-a2b9-0b5a3d3c941b", // UUID tự động tạo
        userId: "82d7fb57-9190-43d2-b501-606222e37228",
        setId: "9e90549d-00bf-4740-9041-997a5129d93f",
        sessionType: "multi-choice",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserSessions", null, {});
  },
};
