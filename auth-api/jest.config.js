/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
require('dotenv').config();
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
