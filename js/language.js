if (localStorage.getItem('lang') == null) {
  localStorage.setItem('lang', 'en');
}

setLanguage(localStorage.getItem('lang'));

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.getElementById('lang-' + lang).checked = true;
}
