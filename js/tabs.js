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

$(document).ready(() => {

  const isTab = id => $('#' + id).filter('.tab-page').length != 0;

  const decodeHash = hash => {

    let selectedTab, selectedElem;

    const maybeTabId = hash + '-tab';

    if (isTab(maybeTabId)) {
      selectedTab = hash;
    } else {
      selectedElem = hash;
      selectedTab = _.join('', _.dropLast(4, $('#' + selectedElem).parents('.tab-page').attr('id')));
      if (!selectedTab || selectedTab.length == 0) {
        location.hash = '';
        return;
      }
    }
    return [selectedTab, selectedElem];

  }

  $(window).on('hashchange', () => {

    const [selectedTab, selectedElem] = decodeHash(location.hash.substr(1));

    if ($('.tab-page:visible').length != 1 || selectedTab + '-tab' != $('.tab-page:visible').attr('id')) {
      $('.tab-page:visible').hide();
      $('.tab-page' + '#' + selectedTab + '-tab').show();
      $('nav input[value=' + selectedTab + ']').prop('checked', true);
    }
    if (selectedElem) {
      const elem = $('#' + selectedElem)[0];
      if (elem) {
        elem.scrollIntoView(); // TODO: must scroll a bit down to avoid being covered by the top bar
      } else {
        location.hash = '#' + selectedTab;
      }
    }
  });

  $('nav > .site-nav input').click((event) => {
    location.hash = $(event.currentTarget).val().toString();
  });

  if (location.hash.length == 0) {
    location.hash = $('nav input[checked]').val().toString();
  }

  $(window).trigger('hashchange');

});
