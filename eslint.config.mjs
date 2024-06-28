import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
    pluginJs.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            globals: globals.node,
        },
    },
];
