module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  rules: {
    semi: ['warn', 'always'],
    'max-len': [
      'warn', 
      {
        code: 160
      }
    ],
    'function-paren-newline': ['error', 'never'],
    allowAllPropertiesOnSameLine: 0,
    quotes: ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'comma-dangle': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'indent': ['error', 2],
    'no-multiple-empty-lines': ['error', { 'max': 1 }]
  },
  overrides: [{
    'files': ['*.vue'],
    'rules' : {
      'indent': 'off',
      'vue/script-indent': ['error', 2, { 'baseIndent': 1 }]
    }
  }],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  ignorePatterns: ['node_modules', 'build', 'dist', 'public', 'icons', 'vitest.config.js'],
  env: {
    node: true
  }
};
  