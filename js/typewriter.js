/* Typewriter text animation */

document.addEventListener("DOMContentLoaded", function () {

  window.typewriter = {
    element: document.getElementById("typewriter"),
    contents: [
      "I write code.\xa0",
      "I write software.\xa0",
      "I write websites.",
      "I write apps.\xa0",
      "I write libraries.\xa0",
      "I write simulations.\xa0",
      "I design experiences.\xa0",
      "I design interfaces.\xa0",
    ],
    contentIndex: 0,

    // A random delay in ms will be chosen from this range. The resulting delay
    // is multiplied for typing, so this isn't exact.
    typingDelay: [50, 100],

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

    _getTypingDelay: function() {
      return Math.floor(Math.random() * (this.typingDelay[1] - this.typingDelay[0]) + this.typingDelay[0]);
    },

    /* Animate bacspacing by a given number of characters */
    backspace: function(num, callback) {
      var content, toGo = num;
      callback = callback || function() {};
      this._backspace1 = function() {
        if (toGo === 0) {
          callback();
        } else {
          content = this.element.textContent;
          this.element.textContent = content.slice(0, content.length - 1);
          toGo--;
          setTimeout(function(){typewriter._backspace1();}, this._getTypingDelay());
        }
      };
      this._backspace1();
    },

    /* Animate inserting a given string at the end of the text */
    type: function(text, callback) {
      var i = 0;
      callback = callback || function() {};
      this._type1 = function() {
        if (i === text.length) {
          callback();
        } else {
          this.element.textContent += text[i];
          i++;
          setTimeout(function(){typewriter._type1();}, this._getTypingDelay() * 1.5);
        }
      };
      this._type1();
    },

    /* Animate advancing to the next phrase */
    next: function(callback) {
      this.contentIndex++;
      // Loop back
      if (this.contentIndex === this.contents.length) {
        this.contentIndex = 0;
      }
      // Make changes
      var changesNeeded = this._transitionDescription(
        this.element.textContent,
        this.contents[this.contentIndex]
      );
      this.backspace(changesNeeded.del, function() {
        setTimeout(function(){typewriter.type(changesNeeded.add, callback);}, 200);
      });
    },

    /* Fill the element with the first phrase (non-animated) and set up other
     * miscellaneous details.
     */
    init: function() {
      this.element.textContent = this.contents[0];
      this._startOnScroll = function() {
        if (
          window.scrollY + window.innerHeight >
          this.element.offsetTop + this.element.offsetHeight / 2
        ) {
          setTimeout(function(){typewriter.play();}, 1000);
          window.removeEventListener("scroll", scrollFunc);
        }
      };
      function scrollFunc() {
        typewriter._startOnScroll();
      }
      window.addEventListener("scroll", scrollFunc);
    },

    /* Recursively continue advancing */
    play: function() {
      this.next(function() {
        setTimeout(function() {
          typewriter.play();
        }, 3000);
      });
    }

  };

  typewriter.init();

});
