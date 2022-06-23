export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/lib/**/__tests__/**/?(*.)+(spec|test).js?(x)"],
  moduleFileExtensions: ["mjs", "js"]
};
