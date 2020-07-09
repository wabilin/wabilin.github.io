// @ts-check

const { JSDOM } = require('jsdom')
const path = require('path')
const { getPosts, fileContent, postPath } = require('./utils/readPosts')
const { read, write } = require('./utils/file')

/**
 * @param {string} name
 */
function getPartialContent(name) {
  const filepath = path.join(process.env.PWD, 'partial', `${name}.html`)
  return read(filepath)
}

const LICENSE_FILES = {
  'cc0': 'license_cc0',
  'cc-by-sa': 'license_cc4_bysa',
}
/**
 * @param {string} license
 */
async function getLicenseHtml(license) {
  const name = LICENSE_FILES[license]
  if (!name) {
    throw new Error('Unknown license')
  }

  return getPartialContent(name)
}

/**
 * @param {Document} document
 * @param {string} key
 */
function getMeta(document, key) {
  const dateMeta = document.querySelector(`meta[property='${key}']`)
  if (!dateMeta) {
    return undefined
  }

  return dateMeta.getAttribute('content')
}

/**
 * @param {Document} document
 */
function addDateH6(document) {
  const main = document.getElementById('main')
  const dateStr = getMeta(document, 'article:published_time')

  if (dateStr) {
    const hg = main.querySelector('hgroup')
    const h6 = document.createElement('h6')
    h6.textContent = dateStr.split('T')[0]
    hg.appendChild(h6)
  }
}

/**
 * @param {Document} document
 */
function rewriteImageToPicture(document) {
  const images = document.querySelectorAll('img')
  images.forEach(image => {

    const webpSource = document.createElement('source')
    webpSource.type = 'image/webp'
    webpSource.srcset = image.src.replace(/\.jpg/i, '.webp')

    const jpgSource = document.createElement('source')
    jpgSource.type = 'image/jpeg'
    jpgSource.srcset = image.src

    const clone = image.cloneNode(false)

    const picture = document.createElement('picture')
    picture.appendChild(webpSource)
    picture.appendChild(jpgSource)
    picture.appendChild(clone)

    const parent = image.parentNode
    parent.insertBefore(picture, image)
    parent.removeChild(image)
  })
}


/**
 * @param {Document} document
 * @param {string} html
 */
function htmlToNode(document, html) {
  const template = document.createElement('template')
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

/**
 * @param {Document} document
 */
async function appendLicenseArea(document) {
  const license = getMeta(document, 'article:license')
  if (!license) { return }

  const html = await getLicenseHtml(license)

  const main = document.getElementById('main')
  const area = htmlToNode(document, html);
  main.appendChild(area)
}

/**
 * @param {Document} document
 */
async function modifyDocument(document) {
  addDateH6(document)
  rewriteImageToPicture(document)
  await appendLicenseArea(document)
}

/**
 * @param {string} file
 * @param {string} content
 * @returns {Promise<void>}
 */
function writePost(file, content) {
  const filePath = postPath(file)
  return write(filePath, content)
}

/**
 * @param {string} file
 */
async function rewritePost(file) {
  const content = await fileContent(file)
  const dom = new JSDOM(content)
  const { document } = dom.window
  await modifyDocument(document)

  const newContent = dom.serialize()
  return writePost(file, newContent)
}

async function main() {
  const posts = await getPosts()

  const doChanges = posts.map(rewritePost)
  return Promise.all(doChanges)
}
main().catch(e => console.error(e))