function navUpdate() {
  const hash = window.location.hash.startsWith('#')
                 ? window.location.hash.substring(1)
                 : window.location.hash;

  const linkToHere = document.getElementById('navigation').querySelector(`a[href='#${hash}']`);

  console.log(linkToHere);
  document.getElementById('navigation').querySelectorAll('a').forEach(a => a.classList.remove('selected'));
  linkToHere.classList.add('selected');
}

window.navUpdate = navUpdate;

window.addEventListener('hashchange', navUpdate);
