function load_stackoverflow_info() {
  const url = 'https://api.stackexchange.com/2.3/users/5825294?order=desc&sort=reputation&site=stackoverflow';
  fetch(url)
  .then(response => response.text())
  .then(responseBody => {
    const items = JSON.parse(responseBody).items;
    if (items) {
      const reputation = items[0].reputation;
      const badge_counts = items[0].badge_counts;
      document.getElementById('reputation').innerHTML = reputation;
      document.getElementById('bronze-badges').innerHTML = badge_counts.bronze;
      document.getElementById('silver-badges').innerHTML = badge_counts.silver;
      document.getElementById('gold-badges').innerHTML = badge_counts.gold;
    }
  });
}
