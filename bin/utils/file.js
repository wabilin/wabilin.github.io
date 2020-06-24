const fs = require('fs')

/**
 * @param {string} filePath
 * @returns {Promise<string>}
 */
function read(filePath) {
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
 * @param {string} filePath
 * @param {string} content
 * @returns {Promise<void>}
 */
function write(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    });
  })
}

module.exports = {
  read,
  write,
}
