const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom')

const POSTS_PATH = path.join(__dirname, '..', '..', 'dist');

/**
 * @param {string} filename
 */
function isPost(filename) {
  return filename.match(/^\d+-\d+-\d+-/) !== null;
}

/**
 * @param {string} file
 */
function postPath(file) {
  return path.join(POSTS_PATH, file)
}

/**
 * @param {string} filename
 * @returns {Promise<string>}
 */
async function fileContent(file) {
  const filePath = postPath(file)

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * @param {string} file
 */
async function fileToDomDocument(file) {
  const content = await fileContent(file)
  const { document } = new JSDOM(content).window
  return document
}

/**
 * @returns {Promise<string[]>}
 */
function getPosts() {
  return new Promise((resolve, reject) => {
    fs.readdir(POSTS_PATH, function (err, files) {
      if (err) {
        reject(err)
      } else {
        resolve(files.filter(isPost))
      }
    });
  })
}

module.exports = {
  POSTS_PATH,
  postPath,
  fileContent,
  fileToDomDocument,
  getPosts,
}
