module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "no-dupe-keys": "off",
    "no-console": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-use-v-if-with-v-for": "off",
    "vue/no-mutating-props": "off",
  },
}
