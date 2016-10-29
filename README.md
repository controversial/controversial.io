# [controversial.io](https://controversial.io/) [![Build Status](https://travis-ci.com/controversial/controversial.io.svg?token=e29Jzu9ow6nbDMpQAydD&branch=master)](https://travis-ci.com/controversial/controversial.io)

This is my website. There are many like it, but this one is mine.<sup>[[1]](https://en.wikipedia.org/wiki/Rifleman%27s_Creed)</sup>

This website is comprised entirely of my own code – no external libraries are loaded excluding fonts.

# Code style
All of the JavaScript in this website is written using next generation ES6 features. The ES6 code is compliant with [Airbnb's JavaScript style guide](https://github.com/airbnb/javascript). The code is then transpiled to ES5 using [Babel](https://babeljs.io) so that older browsers can execute it.

All of the CSS for this website is written using the [Sass indented syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html). This is linted using [sass-lint](https://github.com/sasstools/sass-lint) and a custom style guide (found in `.sass-lint.yml`).

You can check code style by running `npm test` and can compile everything with `npm run build`.
