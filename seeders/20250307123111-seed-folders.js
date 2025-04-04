"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Folders", [
      {
        id: "5566f6c4-7aa7-4cee-9c84-61e8c8d1791e", // Unique UUID for folder
        name: "Math",
        description: "Math-related flashcards",
        userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID
        isPublic: true,
        statusId: 1, // Active
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
        name: "English",
        description: "English Vocabulary",
        userId: "82d7fb57-9190-43d2-b501-606222e37228", // Replace with a valid user UUID
        isPublic: false,
        statusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Folders", null, {});
  },
};
