module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'plugin:functional/external-typescript-recommended',
        'plugin:react-hooks/recommended',
        'prettier', // put prettier last
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: ['functional', 'react-refresh'],
    root: true,
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/method-signature-style': 'warn',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        '@typescript-eslint/sort-type-constituents': 'warn',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        // Do not throw Promise rejections when using `await`: disallow them
        'functional/no-promise-reject': 'error',
        'functional/no-throw-statements': 'error',
        'functional/no-try-statements': ['warn', { allowFinally: true }],
        'functional/immutable-data': 'error',
        'functional/no-let': ['error', { allowInFunctions: true }],
        'functional/no-mixed-types': 'warn',
        'functional/no-expression-statements': ['warn', { ignoreVoid: true }],
        'functional/no-loop-statements': 'warn',
        'functional/no-return-void': [
            'warn',
            { allowNull: true, allowUndefined: false },
        ],
        'functional/prefer-property-signatures': 'warn',
        'functional/prefer-tacit': 'warn',
        'react-refresh/only-export-components': 'warn',
    },
    overrides: [
        {
            files: ['**/*.tsx'],
            rules: {
                'functional/no-mixed-types': 'off',
            },
        },
    ],
}
