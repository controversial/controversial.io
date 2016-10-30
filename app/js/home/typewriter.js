/* Typewriter text animation */

/* Typewriter class
 * The callback passed will be called with full strings, which should be used as text. This class
 * takes care of partial phases, just use the text passed to the callback when it is called.
 */

class Typewriter {
  constructor(phrases, delayRange, callback) {
    this.phrases = phrases;
    this.delayRange = delayRange;
    this.currentPhraseIndex = 0;
    this.callback = callback;
  }

  /* Find the words that are common to the beginning of two phrases. */
  static findCommonStart(phraseA, phraseB) {
    const aWords = phraseA.split(' ');
    const bWords = phraseB.split(' ');

    const commonWords = [];
    for (let i = 0; i < aWords.length; i += 1) {
      if (aWords[i] === bWords[i]) commonWords.push(aWords[i]);
      else break;
    }
    return commonWords.join(' ');
  }

  /* Get instructions for transforming between two strings in the form of
   * number of characters to delete and characters to add.
   */
  transitionDescription(phraseA, phraseB) {
    const commonStart = this.commonStart(phraseA, phraseB);
    const numCharactersToDelete = phraseA.length - commonStart.length;
    const charactersToAdd = phraseB.slice(commonStart.length);
    return {
      del: numCharactersToDelete,
      add: charactersToAdd,
    };
  }

  /* Pick a delay length from the delay range */
  getTypingDelay() {
    return Math.floor(
      (Math.random() * (this.delayRange[1] - this.delayRange[0])) + this.delayRange[0]
    );
  }
}


document.addEventListener('DOMContentLoaded', () => {
  window.typewriter = {
    element: document.getElementById('typewriter'),
    contents: [
      'I write code.\xa0',
      'I write software.\xa0',
      'I write websites.\xa0',
      'I write apps.\xa0',
      'I write libraries.\xa0',
      'I write simulations.\xa0',
      'I design experiences.\xa0',
      'I design interfaces.\xa0',
    ],
    contentIndex: 0,

    // A random delay in ms will be chosen from this range. The resulting delay
    // is multiplied for typing, so this isn't exact.
    typingDelay: [50, 100],

    /* Find common words that two strings start with. */
    commonStart(a, b) {
      const aWords = a.split(' ');
      const bWords = b.split(' ');

      const commonWords = [];
      for (let i = 0; i < aWords.length; i += 1) {
        if (aWords[i] === bWords[i]) {
          commonWords.push(aWords[i]);
        } else {
          break;
        }
      }
      return commonWords.join(' ');
    },

    /* Get instructions for transforming between two strings in the form of
     * number of characters to delete and characters to add.
     */
    transitionDescription(a, b) {
      const common = this.commonStart(a, b);
      const numCharactersToDelete = a.length - common.length;
      const charactersToAdd = b.slice(common.length);
      return {
        del: numCharactersToDelete,
        add: charactersToAdd,
      };
    },

    getTypingDelay() {
      return Math.floor(
        (Math.random() * (this.typingDelay[1] - this.typingDelay[0])) + this.typingDelay[0]
      );
    },

    /* Animate backspacing by a given number of characters */
    backspace(num, callback) {
      let content;
      let toGo = num;
      const callback2 = callback || (() => {});
      this.backspaceOne = () => {
        if (toGo === 0) {
          callback2();
        } else {
          content = this.element.textContent;
          this.element.textContent = content.slice(0, content.length - 1);
          toGo -= 1;
          setTimeout(() => window.typewriter.backspaceOne(), this.getTypingDelay());
        }
      };
      this.backspaceOne();
    },

    /* Animate inserting a given string at the end of the text */
    type(text, callback) {
      let i = 0;
      const callback2 = callback || (() => {});
      this.typeOne = () => {
        if (i === text.length) {
          callback2();
        } else {
          this.element.textContent += text[i];
          i += 1;
          setTimeout(() => window.typewriter.typeOne(), this.getTypingDelay() * 1.5);
        }
      };
      this.typeOne();
    },

    /* Animate advancing to the next phrase */
    next(callback) {
      this.contentIndex += 1;
      // Loop back
      if (this.contentIndex === this.contents.length) {
        this.contentIndex = 0;
      }
      // Make changes
      const changesNeeded = this.transitionDescription(
        this.element.textContent,
        this.contents[this.contentIndex]
      );
      this.backspace(changesNeeded.del, () => {
        setTimeout(() => window.typewriter.type(changesNeeded.add, callback), 200);
      });
    },

    /* Fill the element with the first phrase (non-animated) and set up other
     * miscellaneous details.
     */
    init() {
      function scrollFunc() {
        window.typewriter.startOnScroll();
      }
      this.element.textContent = this.contents[0];
      this.startOnScroll = () => {
        if (
          window.scrollY + window.innerHeight >
          this.element.offsetTop + (this.element.offsetHeight / 2)
        ) {
          setTimeout(() => window.typewriter.play(), 1000);
          window.removeEventListener('scroll', scrollFunc);
        }
      };
      window.addEventListener('scroll', scrollFunc);
    },

    /* Recursively continue advancing */
    play() {
      this.next(() => {
        setTimeout(() => window.typewriter.play(), 3000);
      });
    },

  };

  window.typewriter.init();
});
