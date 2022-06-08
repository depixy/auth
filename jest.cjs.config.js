import config from "./jest.config.js";

export default {
  ...config,
  testMatch: ["**/lib/cjs/**/__tests__/**/?(*.)+(spec|test).js?(x)"]
};
