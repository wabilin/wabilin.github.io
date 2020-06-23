const main = document.getElementById('main')
const dateMeta = document.querySelector("meta[property='article:published_time']")
const dateStr = dateMeta && dateMeta.getAttribute('content')

function f(n) {
  return n.toString().padStart(2, '0')
}
if (dateStr) {
  const hg = main.querySelector('hgroup')
  const h6 = document.createElement('h6')
  h6.textContent = dateStr.split('T')[0]
  hg.appendChild(h6)
}
