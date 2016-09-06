/* Typewriter text animation */

document.addEventListener("DOMContentLoaded", function () {

  window.typewriter = {
    element: document.getElementById("typewriter"),
    contents: [
      "I write code.",
      "I write apps.",
      "I create experiences."
    ],
    contentIndex: 0,

    /* Find common words that two strings start with. */
    _commonStart: function (a, b) {
      var aWords = a.split(" ");
      var bWords = b.split(" ");

      var commonWords = [];
      for (var i=0; i<aWords.length; i++) {
        if (aWords[i] === bWords[i]) {
          commonWords.push(aWords[i]);
        } else {
          return commonWords.join(" ");
        }
      }
    },

    /* Get instructions for transforming between two strings in the form of
     * number of characters to delete and characters to add.
     */
    _transitionDescription: function(a, b) {
      var common = this._commonStart(a, b);
      var numCharactersToDelete = a.length - common.length;
      var charactersToAdd = b.slice(common.length);
      return {
        del: numCharactersToDelete,
        add: charactersToAdd
      };
    },

    /* Animate advancing to the next phrase */
    next: function(callback) {

    },

    /* Fill the element with the first phrase (non-animated) and set up other
     * miscellaneous details.
     */
    init: function() {
      this.element.textContent = this.contents[0];
      this.element.style.borderRight = "5px solid #fff";
    },

    /* Recursively continue advancing */
    play: function() {
      next(this.play);
    }

  };

  typewriter.init();

});
