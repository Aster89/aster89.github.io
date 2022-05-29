(function() {
  // Load the script
  const script = document.createElement("script");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
  script.type = 'text/javascript';
  script.addEventListener('load', () => {
    console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
    // use jQuery below
    // the stuff above is taken from [1]

    $(document).ready(() => {
      // some helper function
      const prependHash = str => str == '' ? str : '#' + str;
      // in this demo shown/hidden are actually mapped to green-and-boxed/red-not-boxed
      $('.tab-page').css('display', 'initial');
      $('.tab-page').css('color', 'red');
      $('.tab-page li').css('display', 'table')
      setupTabs({
        //  - read
        getDefaultHash: () => $('nav input[checked]').val().toString(),
        getElemById: id => $('#' + id),
        getHash: () => prependHash($('#hash').val().toString()),
        getId: e => e.attr('id'),
        getParentTab: elem => dropDashTab($('#' + elem).parents('.tab-page').attr('id')),
        getTabPage: name => $('.tab-page' + '#' + name + '-tab'),
        getTabInput: name => $('nav input[value=' + name + ']'),
        getVisibleTabs: () => $('.tab-page').filter(
          function( index ) {
            return this.style.color === 'green';
          }
        ),
        isTab: str => $('#' + str).filter('.tab-page').length != 0,
        //  - write
        actionOnElem: e => {
          $('.tab-page li').css('font-weight', 'normal');
          $('.tab-page li').css('background-color', 'transparent');
          e.css('font-weight', 'bold');
          e.css('background-color', 'lightgreen');
        },
        check: cb => { cb.prop('checked', true); },
        hide: e => {
          $('.tab-page li').css('font-weight', 'normal');
          $('.tab-page li').css('background-color', 'transparent');
          e.css('color', 'red');
          e.children().first().css('border-style', 'none');
        },
        show: e => {
          $('.tab-page li').css('font-weight', 'normal');
          $('.tab-page li').css('background-color', 'transparent');
          e.css('color', 'green');
          e.children().first().css('border-style', 'solid');
        },
        setClickCallback: f => { $('nav input').click(f); },
        setHash: h => { $('#hash').val(h); },
        setHashChangeCallback: f => { $('#hash').change(f); },
        tabInputCallback: eventObj => {
          $('#hash').val($(eventObj.currentTarget).val().toString()).change();
        }
      });
      $('#hash').change();
    });


    // the stuff below is taken from [1]
  });
  document.head.appendChild(script);
})();

// [1]: https://stackoverflow.com/a/10113434/5825294
