function f(t) {
  const sections = document.getElementsByTagName('main')[0].getElementsByTagName('section')
  const sections_array = [...sections];
  sections_array.map(x => x.style.setProperty('display', 'none'));
  if (document.getElementById(t)) {
    document.getElementById(t).style.setProperty('display', 'initial');
  }
}
