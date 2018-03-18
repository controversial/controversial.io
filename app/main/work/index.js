import { CarouselTag, CarouselDots, CarouselCard, Carousel } from './carousel';

export default function init() {
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
}
