const SITE_URL = 'https://wabilin.github.io/'

const shared = {
  title: '上賀茂爆裂魔法使',
  description: '(∩ ◕_▩ )⊃━☆ Explosion!!',
}
const config = {
  site: {
    ...shared,
    url: SITE_URL,
  },
  feed: {
    ...shared,
    image: `${SITE_URL}logo.png`,
    favicon: `${SITE_URL}favicon.ico`,
    copyright: "All rights reserved 2020, Wabilin",
    feedLinks: {
      atom: `${SITE_URL}feed.xml`,
    },
    author: {
      name: "Wabilin",
      link: "https://github.com/wabilin"
    },
    categories: ["Software Development", "Japanese Otaku"]
  }
}

module.exports = {
  config
}
