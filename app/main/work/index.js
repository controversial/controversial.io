import { CarouselTag, CarouselDots, CarouselCard, Carousel } from './carousel';
import fetchStars from './gh-stars';

export default async function init() {
  const projectsContainer = document.getElementsByClassName('projects-container')[0];

  const cardElems = [...projectsContainer.getElementsByClassName('carousel-card')];
  const cards = cardElems.map(c => new CarouselCard(c));

  const dotsElem = document.getElementById('carousel-dots');
  const dots = new CarouselDots(dotsElem);

  const tagsContainer = document.getElementById('tags');
  const tagElems = [...tagsContainer.getElementsByClassName('tag')];
  const tags = tagElems.map(t => new CarouselTag(t));

  const emptyElem = document.getElementById('carousel-empty-state');

  window.workCarousel = new Carousel(cards, dots, tags, emptyElem);

  // Add number of github stars to all applicable cards
  const starsMap = await fetchStars();
  window.starsMap = starsMap;

  const starsElems = projectsContainer.getElementsByClassName('stars-display');
  [...starsElems].forEach((sel) => {
    const repoNames = (sel.dataset.repo || '').split(',').map(t => t.trim());
    const starsCount = repoNames
      .map(r => starsMap[r])    // Number of stars for each
      .reduce((a, b) => a + b); // Sum
    sel.textContent = starsCount;
  });

  // Set up video play buttons
  const videos = [...projectsContainer.getElementsByTagName('video')];
  videos.forEach(v => v.parentNode.addEventListener('click', () => {
    // Play
    v.play();
    v.parentNode.classList.remove('paused');
    // Pause others
    videos.filter(vid => vid !== v).forEach((otherVid) => {
      otherVid.pause();
      otherVid.currentTime = 0;
      otherVid.parentNode.classList.add('paused');
    });
  }));
}
