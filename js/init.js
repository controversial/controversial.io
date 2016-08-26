var ctrl = new ScrollMagic.Controller();
var scenes = [
  new ScrollMagic.Scene({
    duration: "100%"
  })
    .setTween("header > h1", {
      css: {
        opacity: 0,
      }
    })
    .addTo(ctrl)
];
