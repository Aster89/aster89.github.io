function loadStackoverflowInfo() {
  const url = 'https://api.stackexchange.com/2.3/users/5825294?order=desc&sort=reputation&site=stackoverflow';
  fetch(url)
    .then(response => {
      if (response.status >= 200 && response.status <= 299) {
        return response.text();
      }
    })
    .then(responseBody => {
      const items = JSON.parse(responseBody).items;
      if (items) {
        localStorage.setItem('stackoverflow', JSON.stringify(items));
      }
    })
    .finally(() => {
      const itemsStr = localStorage.getItem('stackoverflow');
      if (itemsStr != null) {
        const items = JSON.parse(itemsStr);
        $("#reputation").html(separateThousandsWithComma(items[0].reputation));
        $("#bronze-badges").html(items[0].badge_counts.bronze);
        $("#silver-badges").html(items[0].badge_counts.silver);
        $("#gold-badges").html(items[0].badge_counts.gold);
      }
    });
}

function separateThousandsWithComma(num) {
  return num.toString().match(/(\d{1,3})(?=(\d{3})*$)/g).join();
}
