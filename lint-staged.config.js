/* eslint-env node */
const path = require('path');
const formatCommand = 'prettier ./flowmazonfrontend --check';

module.exports = {
  '*': formatCommand,
};
