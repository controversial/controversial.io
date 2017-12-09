# To-Do List for Redesign
A growing list of what I need to accomplish before the redesign is done

- [ ] "Work" page


- "About" page improvements
  - [x] Improved jump from 3D to flat while scaling
    - Gradually reduce `rotmax` to 0 while shrinking and call `rotate` repeatedly
  - [ ] Reveal social icons when "find me online" clicked
    - 3d "flip" animation around X axis?


- `LaptopCarousel` improvements
  - [x] Close laptops completely and make animation more complex
    - When shifting:
      1. Close current laptop
      2. Rotate
      3. Open new laptop
    - decouples hinge from rotation
  - [x] Open when attempting to scroll down (Listen for `mousewheel`)


- Navigation improvements
  - [ ] Prevent Work page from flickering above other pages during page load
    - Put a solid gray div over the page that is removed when initial navigation is completed


- Improve performance
  - [ ] Implement a `derender` event on `NavigationAnimationBase`
    - Can be used to halt expensive tasks when laptop contents are not visible
  - [x] Implement `will-change` everywhere


- Mobile optimization
  - Improve responsive design
    - [ ] Eventually maybe change laptops for smartphones on mobile devices?
  - [ ] Support device accelerometer for about page
