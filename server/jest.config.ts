/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
    
    roots: ['<rootDir>'],

    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],

    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],       // your TS files
        '^.+\\.js$': ['ts-jest', { useESM: true }],       // ESM packages in node_modules
    },

    transformIgnorePatterns: [
        '/node_modules/(?!camelcase-keys|map-obj)/',      // ESM dependencies to transform
    ],

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',                    // optional, fixes .js imports
    },
    

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/__tests__/testUtils/'
    ]
};

export default config;
