var ctrl = new ScrollMagic.Controller();
var scenes = [
  new ScrollMagic.Scene({
    duration: "100%"
  })
    .setTween("header > h1", {
      css: {
        opacity: 0,
        letterSpacing: "30px",
        autoRound: false
      }
    })
    .addTo(ctrl)
];
