import { CarouselCard, Carousel } from './carousel';

export default function init() {
  const projectsContainer = document.getElementsByClassName('projects-container')[0];
  const cardElems = [...projectsContainer.getElementsByClassName('carousel-card')];
  const cards = cardElems.map((c, i) => new CarouselCard(c, i));
  window.workCarousel = new Carousel(cards);
}