# Overview

## What this library is about

I've created this library according to the instructions contained in [CSS in
Depth][book]'s chapter 10, and as an attempt to force myself to write reusable CSS
(or at least what reusable CSS is based on my understanding) for my personal
blog _**[`std::stream` of consciousness][myblog]**_.

Unfortunately [KSS is long dead][stackoverflow], and it has few bugs.

Therefore, and also because of my laziness, as much as I can be happy with the CSS
components, I don't spend much time to make _this_ page look nice (see how shitty
the TOC on the left is).

## How to read it

With the eyes, I guess.

Generally, if a CSS modules expects some inputs (via what are know of as
_custom variables_), I write that in the documentation of the module.

As regards the HTML snippets that demonstrate the CSS modules, I've sometimes
included a `<style>` tag in them, which in general should not be copied, as
it's only purpose is to make the effect of the module visible.  For instance,
if all a module does is positioning an (pseudo-)element with respect to its
parent, regardless of their contents &mdash; two examples [here][positioning]
&mdash; I use `<style>` to make those elements visible.


[book]: https://www.manning.com/books/css-in-depth
[stackoverflow]: https://stackoverflow.com/a/69004677/5825294
[myblog]: https://aster89.github.io/#about-me
[positioning]: https://aster89.github.io/docs/section-positioning.html
