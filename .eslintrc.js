module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'plugin:jsdoc/recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // use @typescript-eslint/indent instead in typescript!
    'indent': 'off',
    // error
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'no-tabs': ['error'],
    'no-trailing-spaces': ['error'],
    'linebreak-style': ['error', 'unix'],
    // warn
    'no-multiple-empty-lines': ['warn', { max: 2, maxBOF: 0, maxEOF: 1 }],
    'eol-last': ['warn', 'always'],
    'comma-spacing': ['warn', { before: false, after: true }],
    'semi-spacing': ['warn', { before: false, after: true }],
    'key-spacing': ['warn', {
      beforeColon: false,
      afterColon: true,
      mode: 'strict',
    }],
    'switch-colon-spacing': ['warn', { before: false, after: true }],
    'spaced-comment': ['warn', 'always'],
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
    // typescript rules
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
