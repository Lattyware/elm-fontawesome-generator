export default [ 
  {
    "root": true,
    "parser": "@typescript-eslint/parser",
    parserOptions: {
      project: ["tsconfig.json"],
    },
    "plugins": [
      "@typescript-eslint",
      "simple-import-sort",
      "eslint-plugin-prettier"
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended"
    ],
    "rules": {
      "simple-import-sort/imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "destructuredArrayIgnorePattern": "^_" }
      ]
    }
  }
]
