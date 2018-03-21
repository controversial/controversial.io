export default async function fetchStars() {
  // Fetch repos from users 'controversial' and 'arkis'
  const users = ['controversial', 'arkis'];
  const requests = users
    .map(user => `https://api.github.com/users/${user}/repos?per_page=100`)
    .map(url => fetch(url).then(r => r.json()));
  const repos = (await Promise.all(requests)).reduce((a, b) => a.concat(b));
  // Process data into simple object
  const ghStars = {};
  repos.forEach((r) => { ghStars[r.full_name] = r.stargazers_count; });
  window.ghStars = ghStars;
  return ghStars;
}
