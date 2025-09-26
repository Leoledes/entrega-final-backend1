const fs = require('fs/promises');
const path = require('path');

const dataFolderPath = path.resolve(__dirname, '../../data');

const readJson = async (fileName) => {
  const filePath = path.join(dataFolderPath, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(dataFolderPath, { recursive: true });
      await fs.writeFile(filePath, '[]', 'utf8');
      return [];
    }
    throw err;
  }
};

const writeJson = async (fileName, data) => {
  const filePath = path.join(dataFolderPath, fileName);
  try {
    await fs.mkdir(dataFolderPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    throw err;
  }
};

module.exports = { readJson, writeJson };
