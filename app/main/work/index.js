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
  cardElems.forEach((c) => {
    const repoName = c.dataset.repoName;
    const starsElem = c.getElementsByClassName('stars')[0];
    if (starsElem && repoName) {
      const repoNames = repoName.split(',').map(t => t.trim());
      // Sum stars for each repo described
      const starsCount = repoNames.map(r => starsMap[r]).reduce((a, b) => a + b);
      starsElem.textContent = starsCount;
    }
  });
}
