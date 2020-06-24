const { JSDOM } = require('jsdom')
const fs = require('fs')
const { getPosts, fileContent, postPath } = require('./utils/readPosts')

/**
 * @param {Document} document
 */
function modifyDocument(document) {
  const main = document.getElementById('main')
  const dateMeta = document.querySelector("meta[property='article:published_time']")
  const dateStr = dateMeta && dateMeta.getAttribute('content')

  if (dateStr) {
    const hg = main.querySelector('hgroup')
    const h6 = document.createElement('h6')
    h6.textContent = dateStr.split('T')[0]
    hg.appendChild(h6)
  }

  const images = document.querySelectorAll('img')
  images.forEach(image => {
    const clone = image.cloneNode(false)

    const picture = document.createElement('picture')
    const webpSource = document.createElement('source')
    webpSource.type = 'image/webp'
    webpSource.srcset = image.src.replace('.jpg', '.webp')
    const jpgSource = document.createElement('source')
    jpgSource.type = 'image/jpeg'
    jpgSource.srcset = image.src
    picture.appendChild(webpSource)
    picture.appendChild(jpgSource)
    picture.appendChild(clone)

    const parent = image.parentNode
    parent.insertBefore(picture, image)
    parent.removeChild(image)
  })
}

/**
 * @param {string} file
 * @param {string} content
 * @returns {Promise<void>}
 */
function writePost(file, content) {
  const path = postPath(file)

  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    });
  })
}

/**
 * @param {string} file
 */
async function rewritePost(file) {
  const content = await fileContent(file)
  const dom = new JSDOM(content)
  const { document } = dom.window
  modifyDocument(document)

  const newContent = dom.serialize()
  return writePost(file, newContent)
}

async function main() {
  const posts = await getPosts()

  const doChanges = posts.map(rewritePost)
  return Promise.all(doChanges)
}
main().catch(e => console.error(e))
