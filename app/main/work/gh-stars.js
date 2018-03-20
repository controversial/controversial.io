export default async function fetchStars() {
  // Repos from 'controversial' and 'arkis'
  const controversialRepos = await fetch('https://api.github.com/users/controversial/repos?per_page=100')
    .then(r => r.json());
  const arkisRepos = await fetch('https://api.github.com/users/arkis/repos?per_page=100')
    .then(r => r.json());
  const repos = controversialRepos.concat(arkisRepos);

  const ghStars = {};
  repos.forEach((r) => {
    ghStars[r.name] = r.stargazers_count;
  });
  window.ghStars = ghStars;
  return ghStars;
}
