const path = require('path');
const fs = require('fs');
const { Feed } = require('feed')
const { POSTS_PATH, getPosts, fileToDomDocument } = require('./utils/readPosts')

const SITE_URL = 'https://wabilin.github.io/'
const feed = new Feed({
  title: "Wabilin's Blog",
  description: '(∩ ◕_▩ )⊃━☆ Explosion!!',
  id: SITE_URL,
  link: SITE_URL,
  language: "zh",
  image: `${SITE_URL}logo.png`,
  favicon: `${SITE_URL}favicon.ico`,
  copyright: "All rights reserved 2020, Wabilin",
  feedLinks: {
    atom: `${SITE_URL}feed.xml`,
    rss: `${SITE_URL}rss.xml`,
  },
  author: {
    name: "Wabilin",
    link: "https://github.com/wabilin"
  }
});

feed.addCategory("Software Development");
feed.addCategory("Japanese Otaku");

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

  feed.addItem({
    title: postTitle,
    id: fileUrl,
    link: fileUrl,
    description: postTitle,
    content: description,
    date: new Date(file.match(/^\d+-\d+-\d+/)[0]),
  });
}

async function main() {
  const posts = (await getPosts()).sort((a, b) => a.localeCompare(b) * -1)

  for (let post of posts) {
    await parseFile(post)
  }

  const feedAtom = feed.atom1()
  const atomName = path.join(POSTS_PATH, 'feed.xml')

  fs.writeFile(atomName, feedAtom, function (err) {
    if (err) return console.error(err);
  });

  const feedRss = feed.rss2()
  const rssName = path.join(POSTS_PATH, 'rss.xml')
  fs.writeFile(rssName, feedRss, function (err) {
    if (err) return console.error(err);
  });
}

main().catch(err => {
  console.error(err)
})
