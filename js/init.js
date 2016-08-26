var ctrl = new ScrollMagic.Controller();
var scenes = [
  new ScrollMagic.Scene({
    duration: "50%"
  })
    .setTween("header > .down-indicator", {
      opacity: 0,
    })
    .addTo(ctrl)
];

ctrl.scrollTo(function (newpos) {
  TweenLite.to(window, 0.5, {scrollTo: {y: newpos}});
});
