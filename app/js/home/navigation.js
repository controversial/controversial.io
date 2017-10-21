function navigate(hash) {
  console.log(hash);
}

function navUpdate(initial = false) {
  const hash = window.location.hash.startsWith('#')
                 ? window.location.hash.substring(1)
                 : window.location.hash;

  const linkToHere = document.getElementById('navigation').querySelector(`a[href='#${hash}']`);

  document.getElementById('navigation').querySelectorAll('a').forEach(a => a.classList.remove('selected'));
  linkToHere.classList.add('selected');

  // No navigation animation necessary on page load
  if (initial !== true) navigate(hash);
}

window.navUpdate = navUpdate;

window.addEventListener('hashchange', navUpdate);
