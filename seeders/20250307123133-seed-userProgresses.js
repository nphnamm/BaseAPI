"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("UserProgresses", [
      {
        id: "66b813e8-a9f9-49ff-bdbf-69f3d98743e1",
        sessionId: "165d5d76-5c27-4524-a2b9-0b5a3d3c941a",
        cardId: "1c6f1022-1da5-4fcd-b315-8f8d183c5c60",
        isCorrect: true,
        timesAnswered: 1,
        answeredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "9e0201c2-5b5c-46db-9ad6-33af2f543c2a", // UUID tự động tạo
        sessionId: "2513474f-e8d9-452f-ac14-1357b815f8e0",
        cardId: "5eb446c9-9d93-44aa-853a-2fbcf7e4a7f4",
        isCorrect: false,
        timesAnswered: 1,
        answeredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   id: uuidv4(), // UUID tự động tạo
      //   sessionId: "1ed44120-399e-4190-9c00-147bf0bd52b4",
      //   cardId: "19bc510b-1735-4d7b-aec4-c56468b053bf",
      //   isCorrect: false,
      //   answeredAt: new Date(),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: uuidv4(), // UUID tự động tạo
      //   sessionId: "1ed44120-399e-4190-9c00-147bf0bd52b4",
      //   cardId: "3166e0c1-1ed3-4b9c-8906-b82b5e59b41c",
      //   isCorrect: false,
      //   answeredAt: new Date(),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: uuidv4(), // UUID tự động tạo
      //   sessionId: "1ed44120-399e-4190-9c00-147bf0bd52b4",
      //   cardId: "32b9f51f-6724-4504-b0e3-8d92c60e8299",
      //   isCorrect: false,
      //   answeredAt: new Date(),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: uuidv4(), // UUID tự động tạo
      //   sessionId: "1ed44120-399e-4190-9c00-147bf0bd52b4",
      //   cardId: "48b7897b-cb3c-4d32-9806-dc39718c72a2",
      //   isCorrect: false,
      //   answeredAt: new Date(),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: uuidv4(), // UUID tự động tạo
      //   sessionId: "1ed44120-399e-4190-9c00-147bf0bd52b4",
      //   cardId: "60a256b0-6b70-454e-984a-38fb521ebb2b",
      //   isCorrect: false,
      //   answeredAt: new Date(),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserProgresses", null, {});
  },
};
