if (localStorage.getItem('lang') == null) {
  localStorage.setItem('lang', 'en');
}

setLanguage(localStorage.getItem('lang'));

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  $('[lang]:first').attr('lang', lang);
  $('#lang-'+lang).attr('checked', true);
}
