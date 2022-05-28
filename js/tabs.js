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

// Helper functions (pure)
const isString = s => typeof s === 'string' || s instanceof String;
const dropDashTab = str => isString(str) ? str.replace(/-tab$/, '') : str;
const makeDecodeHash = (isTab, getParentTab) =>
  str => {

    let selectedElem;
    let selectedTab;

    const maybeTabId = str + '-tab';

    if (isTab(maybeTabId)) {
      selectedTab = str;
    } else {
      selectedElem = str;
      if (!selectedElem || selectedElem.length == 0) {
        return undefined;
      }
      selectedTab = getParentTab(selectedElem);
      if (!selectedTab || selectedTab.length == 0) {
        return undefined;
      }
    }
    return [selectedTab, selectedElem];
  };

// HTML actions (not pure)
const getHash = () => location.hash;
const setHash = h => { location.hash = h; };
const isTab = str => $('#' + str).filter('.tab-page').length != 0;
const getParentTab = elem => dropDashTab($('#' + elem).parents('.tab-page').attr('id'));
const decodeHash = makeDecodeHash(isTab, getParentTab);

const setupTabs = () => {

  $(window).on('hashchange', () => {

    const maybeHash = decodeHash(getHash().substr(1));

    if (!maybeHash) {
      const n = $('.tab-page:visible').length;
      console.assert(n == 1, "Unexpectedly, " + n + " instead of 1 tab is visible.");
      setHash(dropDashTab('#' + $('.tab-page:visible').attr('id')));
      return;
    }

    const [selectedTab, selectedElem] = maybeHash;

    const visibleTabs = $('.tab-page:visible');

    if (visibleTabs.length == 0 || selectedTab + '-tab' != visibleTabs.attr('id')) {
      visibleTabs.hide();
      $('.tab-page' + '#' + selectedTab + '-tab').show();
      $('nav input[value=' + selectedTab + ']').prop('checked', true);
    }

    const n = $('.tab-page:visible').length;
    console.assert(n == 1, "Unexpectedly, " + n + " instead of 1 tab is visible.");

    if (selectedElem) {
      const elem = $('#' + selectedElem)[0];
      if (elem) {
        elem.scrollIntoView(); // TODO: must scroll a bit down to avoid being covered by the top bar
      } else {
        setHash('#' + selectedTab);
      }
    }
  });

  $('nav input').click((event) => {
    setHash($(event.currentTarget).val().toString());
  });

  if (getHash().length == 0) {
    setHash($('nav input[checked]').val().toString());
  }
};
