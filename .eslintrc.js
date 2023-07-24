module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        'next',
        'next/core-web-vitals'
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    plugins: ['react', 'jsx-a11y'], 
  rules: {
    'react/react-in-jsx-scope': 'off', 
    'react/jsx-uses-react': 'off', 
    'jsx-a11y/anchor-is-valid': 'off', 
  },
  settings: {
    react: {
      version: 'detect', 
    },
  },
}
