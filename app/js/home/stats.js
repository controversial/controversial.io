function get(url, callback) {
  /* eslint-disable no-console */
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = e => (callback || console.log)(e.target.responseText);
  xhr.onerror = () => console.log('error');
  xhr.send();
  /* eslint-enable no-console */
}

// Fill in GitHub repo count and followers count
get('https://api.github.com/users/controversial', (resp) => {
  const data = JSON.parse(resp);
  document.getElementById('gh-repo-count').innerText = data.public_repos;
  document.getElementById('gh-followers-count').innerText = data.followers;
});

// Fill in GitHub contributions count
get('contributions-count.php', (resp) => {
  document.getElementById('gh-contributions-count').innerText = resp;
});

get('https://api.stackexchange.com/2.2/users/4414003?site=stackoverflow', (resp) => {
  const data = JSON.parse(resp).items[0];

  document.getElementById('so-reputation').innerText = data.reputation;

  const badgeCount = data.badge_counts.bronze + data.badge_counts.silver + data.badge_counts.gold;
  document.getElementById('so-badges').innerText = badgeCount;
});

setInterval(() => {
  const age = (new Date() - Date.parse('11/03/2001 17:23')) / 31536000000;
  document.getElementById('age').innerText = age.toFixed(9);
}, 30);
