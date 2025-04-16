/* eslint-env node */
const path = require("path");
const formatCommand =
  "prettier ./flowmazonfrontend --check --config ./flowmazonfrontend/.prettierrc.json --ignore-path ./flowmazonfrontend/.prettierignore";

module.exports = {
  "*": formatCommand,
};
