const SITE_URL = 'https://wabilin.github.io/'

const config = {
  site: {
    url: 'https://github.com/wabilin/',
    description: '(∩ ◕_▩ )⊃━☆ Explosion!!',
    title: 'Explosion!'
  },
  feed: {
    title: "Wabilin's Blog",
    description: '(∩ ◕_▩ )⊃━☆ Explosion!!',
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
