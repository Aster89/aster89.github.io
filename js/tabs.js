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
const jq = s => $(s);
const getElemById = id => document.getElementById(id);
const getHash = () => location.hash;
const setHash = h => { location.hash = h; /* XXX: didn't know that the leading # in h is optional */ };
const isTab = str => jq('#' + str).filter('.tab-page').length != 0;
const getId = e => e.attr('id');
const getParentTab = elem => dropDashTab(getId(jq('#' + elem).parents('.tab-page')));
const decodeHash = makeDecodeHash(isTab, getParentTab);
const getVisibleTabs = () => jq('.tab-page:visible');
const hide = e => e.hide();
const show = e => e.show();
const scrollIntoView = e => e.scrollIntoView();
const check = cb => cb.prop('checked', true)

const setupTabs = () => {

  jq(window).on('hashchange', () => {

    const maybeHash = decodeHash(getHash().substr(1));

    if (!maybeHash) {
      const visibleTabs = getVisibleTabs();
      const n = visibleTabs.length;
      console.assert(n == 1, "Unexpectedly, " + n + " instead of 1 tab is visible.");
      setHash(dropDashTab(getId(visibleTabs)));
      return;
    }

    const [selectedTab, selectedElem] = maybeHash;

    const visibleTabs = getVisibleTabs();
    let n = visibleTabs.length;
    console.assert(n <= 1, n + " visible tabs; it should be 0 or 1 tab.");

    if (visibleTabs.length == 0 || selectedTab + '-tab' != getId(visibleTabs)) {
      hide(visibleTabs);
      show(jq('.tab-page' + '#' + selectedTab + '-tab'));
      check(jq('nav input[value=' + selectedTab + ']'));
    }

    n = getVisibleTabs().length;
    console.assert(n == 1, "Unexpectedly, " + n + " instead of 1 tab is visible.");

    if (selectedElem) {
      const elem = getElemById(selectedElem);
      if (elem) {
        scrollIntoView(elem); // TODO: must scroll a bit down to avoid being covered by the top bar
      } else {
        setHash(selectedTab);
      }
    }
  });

  jq('nav input').click((event) => {
    setHash(jq(event.currentTarget).val().toString());
  });

  if (getHash().length == 0) {
    setHash(jq('nav input[checked]').val().toString());
  }
};
