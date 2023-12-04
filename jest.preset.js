const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

module.exports = {
  ...nxPreset,
  // https://github.com/nrwl/nx/discussions/10382#discussioncomment-2784885
  roots: ['<rootDir>', path.resolve(__dirname, './__mocks__')],
};
