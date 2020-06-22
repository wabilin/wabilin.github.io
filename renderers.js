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

const post = ({ title, link }) => (`
<header class="post-header">
  <h2>
    <a href="${link}">${ title }</a>
  </h2>
</header>
`);

const index = posts => {
  const f = posts[0]
  console.log(JSON.stringify(f))
  const sorted = posts
    .sort((a, b) => a.link.localeCompare(b.link) * -1)
    .map(post)
    .join('')

  return sorted;
}

const head = (document) => {
  document.title = 'Explosion!'
}

module.exports = { metadata, index, head }
