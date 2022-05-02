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

  const tabNames = $('.tab-page').map((y, x) => x.getAttribute('id')).toArray();

  $(window).on('hashchange', function() {

    const [selectedTab, scrollTarget] = _.split('.', location.hash.substr(1));
    const selectedTabId = selectedTab + '-tab';

    if (selectedTabId != $('.tab-page:visible').attr('id')) {
      $('.tab-page:visible').hide();
      $('.tab-page' + '#' + selectedTabId).show();
      $('nav input[value=' + selectedTab + ']').prop('checked', true);
    }
    if (scrollTarget) {
      const elem = $('#' + scrollTarget)[0];
      if (elem) {
        elem.scrollIntoView(); // TODO: must scroll a bit down to avoid being covered by the top bar
      }
    }
  });

  $('nav > .site-nav input').click(function() {
    location.hash = $(this).val().toString();
  });

  if (location.hash.length == 0) {
    location.hash = $('nav input[checked]').val().toString();
  }

  $(window).trigger('hashchange');

});
