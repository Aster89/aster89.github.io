// This JavaScript is needed for the following reason.  The choice of the tab
// happens via the `<nav>` element, which contains a `<input type="radio">`
// corresponding to each tab (specifically a `<section>`). The tabs, on the
// other hand, are not in `<nav>`, so there's no sibling nor parent-child(ren)
// relation between the radio buttons to chose the tabs, and the tabs
// themeselves, therefore [CSS has no way][1] to target the tabs based on some
// pseudo-class of the radio buttons. If the browsers will start supporting
// [Selectors Level 4 Working Draft][2], then maybe something like this could
// be possible:
// ```css
// :root:has(nav input[value=posts]:checked) section[id=posts] {
//   /* these rules apply to `<section id="posts">` when it is checked */
// }
// ```
// However this also means I'd have to write a selector for each new tab that I
// add, because I'm hardcoding the `posts` word in the selector, which is not
// really nice.
//
// Furthermore, the JavaScript/jQuery solution also enables history to work
// for tabs, which is good.
//
// [1]: https://stackoverflow.com/a/1014958/5825294
// [2]: https://dev.w3.org/csswg/selectors4/#relational
$(document).ready(function() {
  // change visible tab and selected radio button on hash change
  $(window).on('hashchange', function() {
    $('.tab-page').hide();
    $('.tab-page' + location.hash + '-tab').show();
    $('nav input[value=' + location.hash.substr(1) + ']').prop('checked', true);
  });

  // change hash on radio button selection
  $('nav > .site-nav input').click(function() {
    location.hash = $(this).val().toString();
  });

  // start-up
  if (location.hash.length == 0) {
    location.hash = $('nav input[checked]').val().toString();
  }
  $(window).trigger('hashchange');
});
