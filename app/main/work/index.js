import { CarouselTag, CarouselCard, Carousel } from './carousel';

export default function init() {
  const projectsContainer = document.getElementsByClassName('projects-container')[0];
  const cardElems = [...projectsContainer.getElementsByClassName('carousel-card')];
  const cards = cardElems.map(c => new CarouselCard(c));

  const tagsContainer = document.getElementsByClassName('tags')[0];
  const tagElems = [...tagsContainer.getElementsByClassName('tag')];
  const tags = tagElems.map(t => new CarouselTag(t));

  window.workCarousel = new Carousel(cards, tags);
}
