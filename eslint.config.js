import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

const compat = new FlatCompat({});

const antfuConfigs = await antfu(
    { typescript: { tsconfigPath: './tsconfig.json' }, stylistic: false },
    { ignores: ['**/*.md'] },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            }
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: { ecmaVersion: 5, sourceType: 'script' }
    },
    {
        rules: {}
    },
    ...compat.config({})
);

export default [
    ...antfuConfigs,
    { files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'] },
    ...compat.config()
];
