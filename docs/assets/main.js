function switchDemo(name, btn) {
  document.querySelectorAll('.demo-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.demo-panel').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('demo-' + name).classList.add('active');
}

function toggleFaq(btn) {
  btn.parentElement.classList.toggle('open');
}
