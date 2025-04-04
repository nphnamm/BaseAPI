"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Sets", [
      {
        id: "9e90549d-00bf-4740-9041-997a5129d93f",
        title: "Algebra Basics",
        description: "Basic algebra concepts and formulas",
        folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f", // Replace with a valid Folder UUID
        userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID
        isPublic: true,

        isDraft: true,
        statusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   id: "ca73f372-9e6e-4ac3-8e8a-d1b35444874d",
      //   title: "Physics Formulas",
      //   description: "Important physics equations and principles",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID

      //   isPublic: false,
      //   cardCount: 15,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "0b8de8f4-d79a-476f-9abd-1cec12d0b5af",
      //   title: "History - World War II",
      //   description: "Key events and figures from World War II",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID

      //   isPublic: true,
      //   cardCount: 20,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      {
        id: "0b8de8f4-d79a-476f-9abd-1cec12d0b5af",
        title: "English Vocabulary (TOEFL)",
        description: "Common TOEFL vocabulary words and definitions",
        folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
        userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID
        isPublic: true,
        isDraft: false,
        statusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   id: "65aa60ed-da57-4b08-b4df-a6c3d62c4d25",
      //   title: "Chemistry - Periodic Table",
      //   description: "Properties and elements of the periodic table",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID

      //   isPublic: false,
      //   cardCount: 30,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "87bf96b1-0b88-4e63-9c24-effe80909b43",
      //   title: "Programming - JavaScript Basics",
      //   description: "Key JavaScript concepts for beginners",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID

      //   isPublic: true,
      //   cardCount: 25,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "0da6873e-78b6-407f-b3f1-ee48a0fa1e66",
      //   title: "Geography - Countries & Capitals",
      //   description: "World countries and their capitals",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID

      //   isPublic: true,
      //   cardCount: 195,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "16c57621-558a-4d1f-b6a9-d42cc560888a",
      //   title: "Biology - Human Anatomy",
      //   description: "Basic human anatomy terms",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID
      //   isPublic: false,
      //   cardCount: 40,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "984305d6-6871-49e1-8db8-97db92fe8482",
      //   title: "French Vocabulary (Beginner)",
      //   description: "Common words and phrases in French",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID

      //   isPublic: true,
      //   cardCount: 100,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "a1396a52-4a61-4a0d-9aa4-dd47bcd2dd12",
      //   title: "Economics - Micro vs Macro",
      //   description: "Key principles of micro and macroeconomics",
      //   folderId: "adace1fd-9dd1-4118-8d7d-1c833cf3be7f",
      //   userId: "f49186a8-c5df-4a1b-8b08-7968a1b3d372", // Replace with a valid user UUID
      //   isPublic: false,
      //   cardCount: 35,
      //   statusId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Sets", null, {});
  },
};
