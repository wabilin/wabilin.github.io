const path = require('path');
const fs = require('fs');
const RSS = require('rss');
const { POSTS_PATH, getPosts, fileToDomDocument } = require('./utils/readPosts')

const SITE_URL = 'https://wabilin.github.io/'

const feed = new RSS({
  title: "Wabilin's Blog",
  description: '(∩ ◕_▩ )⊃━☆ Explosion!!',
  feed_url: `${SITE_URL}feed.xml`,
  site_url: SITE_URL,
  managingEditor: 'Wabilin',
  webMaster: 'Wabilin',
  language: 'zh-tw',
  categories: ['Software Development', 'Japanese Otaku'],
  pubDate: new Date().toUTCString(),
});


/**
 * @param {HTMLElement} article
 */
function transformArticle(article) {
  article.querySelectorAll('img').forEach(img => {
    img.src = img.src.replace('./', SITE_URL)
  })

  article.querySelectorAll('source').forEach(source => {
    source.srcset = source.srcset.replace('./', SITE_URL)
  })

  article.querySelectorAll('a').forEach(a => {
    a.href = a.href.replace('./', SITE_URL)
  })

  return article.innerHTML
}

/**
 * @param {string} filename
 */
async function parseFile(file) {
  const document = await fileToDomDocument(file)

  const section = document.getElementById('main')
  const postTitle = section.querySelector('hgroup > h2').textContent;
  const article = section.querySelector('article')
  const description = transformArticle(article.cloneNode(true))
  const fileUrl = `${SITE_URL}${file}`

  feed.item({
    title: postTitle,
    description: description,
    url: fileUrl,
    categories: [],
    date: file.match(/^\d+-\d+-\d+/)[0],
  });
}

async function main() {
  const posts = (await getPosts()).sort((a, b) => a.localeCompare(b) * -1)

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
