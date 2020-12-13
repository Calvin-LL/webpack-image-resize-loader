module.exports = {
  "*.{js,jsx,ts,tsx}": "eslint --max-warnings 0 --fix",
  "*.{js,jsx,ts,tsx,css,less,scss,vue,json,gql,md}": "prettier --write",
  "*.{md}": "remark --frail",
};
