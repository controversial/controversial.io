# To-Do List for Redesign
A growing list of what I need to accomplish before the redesign is done

---
## Features to implement
#### Home page

#### About page
- [x] Improved jump from 3D to flat while scaling
  - Gradually reduce `rotmax` to 0 while shrinking and call `rotate` repeatedly
- [x] Reveal social icons when "find me online" clicked
  - 3d "flip" animation around X axis?
  - [ ] Add email to back
- [x] Revamp scaling
  - Change units from percentages to viewport units
  - Leave `transform: scale` applied to element when element added to laptop instead of relying on
  - percentage units for size adjustment
  - Fixes:
    - issues with scaling on back side
    - issues with aspect ratio jump
- [ ] Different size card on back???

#### Work page
- [ ] the whole thing

#### Navigation
- [x] Close laptops completely and make animation more complex
  - When shifting:
    1. Close current laptop
    2. Rotate
    3. Open new laptop
  - decouples hinge from rotation
- [x] Open when attempting to scroll down (Listen for `mousewheel`)

#### Misc
- Performance improvements
  - [ ] Implement a `derender` event on `NavigationAnimationBase`
    - Can be used to halt expensive tasks when laptop contents are not visible
  - [x] Implement `will-change` everywhere

- [ ] New animation on bottom right social icons
- [ ] Hover animation on top right hamburger button

- Mobile optimization
  - Improve responsive design
    - [ ] Eventually maybe change laptops for smartphones on mobile devices?
  - [ ] Support device accelerometer for about page

---

## Bugs to fix

#### Home page
#### About page
#### Work page
#### Navigation
- [x] Don't fuck up animations when triggering too many animations at once
- [ ] Prevent Work page from flickering above other pages during page load
  - Put a solid gray div over the page that is removed when initial navigation is completed
- [ ] Flicker of pages being too small when opening
  - Scale is applied before element is removed, perhaps?
