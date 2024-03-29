module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    env: {
        jest: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {},
    parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
    },
}
