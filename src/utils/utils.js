/* eslint-disable no-await-in-loop */
const fs = require('fs/promises');
const path = require('path');

const readFiles = async (givenPath) => {
  const results = [];

  const core = async (dir) => {
    const dirPath = path.join(__dirname, '../', dir);
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(__dirname, '../', dir, file);
      const stat = await fs.lstat(filePath);

      if (stat.isDirectory()) {
        const nextDir = path.join(dir, file);
        await core(nextDir);
      }

      if (file.endsWith('.js')) {
        results.push(filePath);
      }
    }
  };

  await core(givenPath);
  return results;
};

const checkPerm = (member, perm) => member.permissions.has(perm);

module.exports = {
  readFiles,
  checkPerm,
};
