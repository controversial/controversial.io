function get(url, callback) {
  /* eslint-disable no-console */
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = e => (callback || console.log)(e.target.responseText);
  xhr.onerror = () => console.log('error');
  xhr.send();
  /* eslint-enable no-console */
}

// Testing
get('https://api.github.com/users/controversial', (resp) => {
  const data = JSON.parse(resp);
  document.getElementById('gh-repo-count').innerText = data.public_repos;
  document.getElementById('gh-followers-count').innerText = data.followers;
});
