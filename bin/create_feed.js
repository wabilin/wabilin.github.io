const path = require('path');
const fs = require('fs');
const jsdom = require("jsdom");
const RSS = require('rss');

const { JSDOM } = jsdom;

const directoryPath = path.join(__dirname, '..', 'dist');

/**
 * @param {string} filename
 */
function isPost(filename) {
  return filename.match(/^\d+-\d+-\d+-/) !== null;
}

const SITE_URL = 'https://wabilin.github.io/'

const feed = new RSS({
  title: 'title',
  description: 'description',
  feed_url: `${SITE_URL}feed.xml`,
  site_url: SITE_URL,
  managingEditor: 'Wabilin',
  webMaster: 'Wabilin',
  language: 'zh-tw',
  categories: ['Software Development', 'Japanese Otaku'],
  pubDate: new Date().toUTCString(),
});

/**
 * @param {string} filename
 */
function fileContent(file) {
  const filePath = path.join(directoryPath, file)
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

/**
 * @param {string} filename
 */
function parseFile(file) {
  const content = fileContent(file)
  const { document } = new JSDOM(content).window

  const section = document.getElementById('main')
  const postTitle = section.querySelector('hgroup > h2').textContent;
  const article = section.querySelector('article').innerHTML
  const fileUrl = `${SITE_URL}${file}`

  feed.item({
    title: postTitle,
    description: postTitle,
    url: fileUrl,
    categories: [],
    date: file.match(/^\d+-\d+-\d+/)[0],
    custom_elements: [
      {
        content: [
          { _attr: { type: "html", "xml:base": fileUrl } },
          article,
        ]
      },
    ]
  });
}

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  files.filter(isPost).forEach(parseFile);

  const feedXml = feed.xml()
  const distName = path.join(directoryPath, 'feed.xml')

  fs.writeFile(distName, feedXml, function (err) {
    if (err) return console.error(err);
  });
});
