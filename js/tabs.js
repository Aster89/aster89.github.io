var tabs = document.querySelectorAll('[role=tab]'); //get all role=tab elements as a variable
for (i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", showTabPanel);
} //add click event to each tab to run the showTabPanel function 
function showTabPanel(el) { //runs when tab is clicked
  var tabs2 = document.querySelectorAll('[role=tab]'); //get tabs again as a different variable 
  for (i = 0; i < tabs2.length; i++) {
    tabs2[i].setAttribute('aria-selected', 'false');
    tabs2[i].setAttribute('style', 'font-weight:normal');
  } //reset all tabs to aria-selected=false and normal font weight
  el.target.setAttribute('aria-selected', 'true'); //set aria-selected=true for clicked tab
  el.target.setAttribute('style', 'font-weight:bold'); //make clicked tab have bold font
  var tabPanelToOpen = el.target.getAttribute('aria-controls'); //get the aria-controls value of the tab that was clicked
  var tabPanels = document.querySelectorAll('[role=tabpanel]'); //get all tabpanels as a variable
  for (i = 0; i < tabPanels.length; i++) {
    tabPanels[i].style.display = "none";
  } //hide all tabpanels
  document.getElementById(tabPanelToOpen).style.display = "block"; //show tabpanel who's tab was clicked
}
/*
 * TODO: why doesn't this work?
$('[role=tablist]').keydown(function(e) {
  if (e.keyCode == 37) {
    $("[aria-selected=true]").prev().click().focus();
    e.preventDefault();
  }
  if (e.keyCode == 38) {
    $("[aria-selected=true]").prev().click().focus();
    e.preventDefault();
  }
  if (e.keyCode == 39) {
    $("[aria-selected=true]").next().click().focus();
    e.preventDefault();
  }
  if (e.keyCode == 40) {
    $("[aria-selected=true]").next().click().focus();
    e.preventDefault();
  }
});
*/
