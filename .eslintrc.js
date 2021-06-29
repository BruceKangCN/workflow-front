module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-tabs': ['error'],
    'indent': 'off', // use @typescript-eslint/indent instead in typescript!
    'semi': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': ['warn', 'single'],
    'max-len': ['warn', {
      code: 80,
      tabWidth: 2,
      ignorePattern: '^import .+;?$', // ignore import statements
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreRegExpLiterals: true,
    }],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
