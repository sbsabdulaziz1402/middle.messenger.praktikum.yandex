import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
    },
    extensionsToTreatAsEsm: [".ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    verbose: true,
  };
};
