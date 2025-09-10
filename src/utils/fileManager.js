const fs = require("fs/promises");
const path = require("path");

function getFilePath(fileName) {
  return path.resolve(__dirname, "../../data", fileName);
}

async function readJson(fileName) {
  try {
    const filePath = getFilePath(fileName);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw new Error(`Error leyendo ${fileName}: ${err.message}`);
  }
}

async function writeJson(fileName, content) {
  try {
    const filePath = getFilePath(fileName);
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  } catch (err) {
    throw new Error(`Error escribiendo ${fileName}: ${err.message}`);
  }
}

module.exports = { readJson, writeJson };
