const metadata = {
  title: 'wabilin',
  subtitle: '',
  rights: '',
  url: 'https://wabilin.github.io/',
  logo: '',
  icon: '',

  author: 'wabilin',
  email: '',
  uri: '',

  categories: [],
}

const post = ({ title, link }) => {
  const timeStr = link.match(/\d+-\d+-\d+/)[0] || ''

  return `
<header class="post-header">
  <h3 class="post-time">${timeStr}</h3>
  <h2>
    <a href="${link}">${title}</a>
  </h2>
</header>
`
};

const index = posts => {
  const sorted = posts
    .sort((a, b) => a.link.localeCompare(b.link) * -1)
    .map(post)
    .join('')

  return sorted;
}

const head = (document, data) => {
  document.title = 'Explosion!'

  if (!data)
    return

  const meta = (name, content) => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', name)
    meta.setAttribute('content', content)
    document.head.appendChild(meta)
  }

  meta('og:type', 'article')
  if ('title' in data) {
    document.title += ` | ${data.title}`
    meta('og:title', data.title)
  }

  if ('link' in data) {
    const dateMatch = data.link.match(/\d\d\d\d-\d\d-\d\d/)
    const date = dateMatch && dateMatch[0]
    meta('article:published_time', new Date(date).toISOString())
  }

  if ('tags' in data) {
    meta('article:tag', data.tags)
  }

  if ('license' in data) {
    meta('article:license', data.license)
  }
}

module.exports = { metadata, index, head }
