function loadStackoverflowInfo() {
  const url = 'https://api.stackexchange.com/2.3/users/5825294?order=desc&sort=reputation&site=stackoverflow';
  fetch(url)
  .then(response => response.text())
  .then(responseBody => {
    const items = JSON.parse(responseBody).items;
    if (items) {
      const reputation = items[0].reputation;
      const badge_counts = items[0].badge_counts;
      document.getElementById('reputation').innerHTML = separateThousandsWithComma(reputation);
      document.getElementById('bronze-badges').innerHTML = badge_counts.bronze;
      document.getElementById('silver-badges').innerHTML = badge_counts.silver;
      document.getElementById('gold-badges').innerHTML = badge_counts.gold;
    }
  });
}

function separateThousandsWithComma(num) {
  return num.toString().match(/(\d{1,3})(?=(\d{3})*$)/g).join();
}
