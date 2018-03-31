async function requestStars() {
  // Fetch repos from users 'controversial' and 'arkis'
  const users = ['controversial', 'arkis', 'pythonista-cloud'];
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

// Includes caching
export default async function fetchStars() {
  let ghStars;
  const timeSinceRequest = new Date() - new Date(localStorage.ghStarsTimestamp);
  // Requested within last half hour; no need to request again
  if (localStorage.ghStars && timeSinceRequest < 1800000) {
    ghStars = JSON.parse(localStorage.ghStars);
  // Never requested or it's been more than half an hour (need to request again)
  } else {
    localStorage.ghStarsTimestamp = new Date(); // Record time info was requested
    ghStars = await requestStars();
    localStorage.ghStars = JSON.stringify(ghStars);
  }
  return ghStars;
}
