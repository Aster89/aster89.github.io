$(document).ready(() => {
  setupTabs({
    // Actions (impure functions, as they read from/write to the global state
    // represented by the HTML):
    //  - read
    getDefaultHash: () => $('nav input[checked]').val().toString(),
    getElemById: id => document.getElementById(id),
    getHash: () => location.hash,
    getId: e => e.attr('id'),
    getParentTab: elem => dropDashTab($('#' + elem).parents('.tab-page').attr('id')),
    getTabPage: name => $('.tab-page' + '#' + name + '-tab'),
    getTabInput: name => $('nav input[value=' + name + ']'),
    getVisibleTabs: () => $('.tab-page:visible'),
    isTab: str => $('#' + str).filter('.tab-page').length != 0,
    //  - write
    actionOnElem: e => e.scrollIntoView(), // TODO: must scroll a bit down to avoid being covered by the top bar
    check: cb => cb.prop('checked', true),
    hide: e => e.hide(),
    show: e => e.show(),
    setClickCallback: f => $('nav input').click(f),
    setHash: h => { location.hash = h; },
    setHashChangeCallback: f => $(window).on('hashchange', f),
    tabInputCallback: eventObj => { location.hash = $(eventObj.currentTarget).val().toString(); }
  });
  $(window).trigger('hashchange');
});
