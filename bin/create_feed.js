const path = require('path');
const fs = require('fs');
const RSS = require('rss');
const { POSTS_PATH, getPosts, fileToDomDocument } = require('./utils/readPosts')

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
async function parseFile(file) {
  const document = await fileToDomDocument(file)

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

async function main() {
  const posts = await getPosts()

  for (let post of posts) {
    await parseFile(post)
  }

  const feedXml = feed.xml()
  const distName = path.join(POSTS_PATH, 'feed.xml')

  fs.writeFile(distName, feedXml, function (err) {
    if (err) return console.error(err);
  });
}

main().catch(err => {
  console.error(err)
})
