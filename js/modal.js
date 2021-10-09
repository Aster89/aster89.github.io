var close = document.getElementById('close');
var modal = document.getElementById('modal');
close.addEventListener('click', function (event) {
  event.preventDefault();
  modal.style.display = 'none';
});
