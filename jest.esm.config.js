import config from "./jest.config.js";

export default {
  ...config,
  testMatch: ["**/lib/esm/**/__tests__/**/?(*.)+(spec|test).js?(x)"],
  moduleFileExtensions: ["mjs", "js"]
};
