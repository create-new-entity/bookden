import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {
            js,
            '@stylistic/js': stylisticJs
        },
        extends: ['js/recommended'],
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            'no-await-in-loop': 'error',
            '@stylistic/js/indent': ['error', 4],
            '@stylistic/js/semi': ['error'],
            '@stylistic/js/quotes': ['error', 'single']
        }
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs'
        }
    },
    tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_'
                }
            ]
        }
    },
    globalIgnores(['migrations/', 'build/'])
]);
