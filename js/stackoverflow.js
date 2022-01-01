const rotate = _.curry((n,v) => {
  const M = v.length;
  const m = ((n % M) + M) % M;
  return _.flatten([_.drop(m, v), _.take(m, v)]);
});

/**
 * URL-manip functions and constants.
 */
const setSearchParam = (url, key, value) => {
  url.searchParams.set(key, value);
  return url;
};
const setSearchParams = (url, obj) => {
  Object.entries(obj).forEach(e => {
    const [k, v] = e;
    setSearchParam(url, k, v);
  });
  return url;
};
const appendFilter = (filter, url) => setSearchParam(url, 'filter', filter);

function incrementURLPage(url) {
  // XXX: This is actually mutating `url`. Probably I don't care...  What about
  // deep copying? Probably the garbage collector can do a good job...
  return attachPageToURL(url, Number(url.searchParams.get('page')) + 1);

  function attachPageToURL(url, page) {
    // XXX: ditto
    url.searchParams.set('page', page.toFixed(0));
    return url;
  }
}

function fetchAllJSONItems(url) {
  return fetchAllJSONItemsImpl(url)
    .catch(error => {
      console.error('Fetch not complete because of "' + `${error}`
        + '"; throwing away everything and returning empty array.');
      return [];
    });

  function fetchAllJSONItemsImpl(url) {
    return fetch(setCommonParams(url).toString())
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(async JSONbody => {
        console.log("quota_remaining = " + JSONbody.quota_remaining);
        if (JSONbody.backoff) {
          const sleep = (sec = 1) => new Promise((r) => setTimeout(r, sec * 1e3));
          await sleep(JSONbody.backoff);
          return fetchAllJSONItemsImpl(url).then(more => JSONbody.items.concat(more));
        }
        if (JSONbody.has_more) {
          return fetchAllJSONItemsImpl(incrementURLPage(url)).then(more => JSONbody.items.concat(more));
        }
        return JSONbody.items;
      });

    function setCommonParams(url) {
      return setSearchParams(url, {site: 'stackoverflow', key: '7z9N1)FsIJR4xwpIVNBYJA(('});
    }
  }
}

const API = (() => {
  const API_BASE = "https://api.stackexchange.com";
  const API_VER = 2.3;
  return `${API_BASE}/${API_VER}`;
})();

const ME = '5825294'; // my id

function downloadSOBadgesAndTotalRep() {
  return fetchAllJSONItems(new URL(`${API}/users/${ME}`))
    .then(items => {
      if (items.length != 0) {
        return {
          rep: items[0].reputation,
          bronze: items[0].badge_counts.bronze,
          silver: items[0].badge_counts.silver,
          gold: items[0].badge_counts.gold
        };
      } else {
        throw new Error('Fetch resulted in empty `items` array.');
      }
    })
    .catch(error => {
      console.error('Fetch error because of "' + `${error}`
        + '"; returning empty object.');
      return {};
    });
}

function updateOrPickOld(nameInLocalStorage, getNewValue) {

  const lastUpdate = JSON.parse(localStorage.getItem('LastUpdate'));
  const oldValue = JSON.parse(localStorage.getItem(nameInLocalStorage));
  const tooOld = Math.round(Date.now()/1000) - lastUpdate > 3600;

  const mustUpdate = lastUpdate === null || oldValue === null || tooOld;

  return Promise.all([
    mustUpdate ? getNewValue() : oldValue,
    oldValue,
    mustUpdate
  ])
    .then(([newValue, oldValue, triedUpdate]) => {
      if (!_.isEmpty(newValue) && triedUpdate) {
        setInLocalStorage(nameInLocalStorage, JSON.stringify(newValue));
      }
      return newValue;
    });

  function setInLocalStorage(key, valueStr) {
    localStorage.setItem(key, valueStr);
    localStorage.setItem('LastUpdate', JSON.stringify(Math.round(Date.now()/1000)));
  }
}

function populateSOProfileWidged() {
  updateOrPickOld('BadgesAndTotRep', downloadSOBadgesAndTotalRep)
    .finally(() => {
      const items = JSON.parse(localStorage.getItem('BadgesAndTotRep'));
      if (!_.isEmpty(items)) {
        const separateThousandsWithComma = num => num.toString().match(/(\d{1,3})(?=(\d{3})*$)/g).join();
        $("#reputation").html(separateThousandsWithComma(items.rep));
        $("#bronze-badges").html(items.bronze);
        $("#silver-badges").html(items.silver);
        $("#gold-badges").html(items.gold);
      }
    });
}

const getRepChanges = () => fetchAllJSONItems(
  appendFilter(
    '!-0(_vn*f-VJQ', // selects only `reputation_change`, `post_type`, and `post_id`
    new URL(`${API}/users/${ME}/reputation`)
  )
);
const getQsWithAsFromAsIds = ids => fetchAllJSONItems(
  appendFilter(
    '!nKzQUR.HO9', // includes `answer`s in each `question`
    new URL(`${API}/answers/${ids}/questions`)
  )
);
const getQsFromIds = ids => fetchAllJSONItems(new URL(`${API}/questions/${ids}`));

function repChangesToRepByTag(repChanges) {

  const getPostIdRepAndType = _.compose(
    _.filter('reputation_change'),
    _.map(
      _.compose(
        _.zipObject(['post_type', 'post_id', 'reputation_change']),
        _.over([
          _.compose(_.iteratee('post_type'), _.head),
          _.compose(_.iteratee('post_id'), _.head),
          _.compose(_.sum, _.map(_.iteratee('reputation_change')))
        ])
      )
    ),
    _.values,
    _.groupBy('post_id')
  );

  let { question: repChangesFromQs, answer: repChangesFromAs } = _.groupBy('post_type', getPostIdRepAndType(repChanges));
  repChangesFromAs = _.map(_.pick(['post_id', 'reputation_change']), repChangesFromAs);
  repChangesFromQs = _.map(_.pick(['post_id', 'reputation_change']), repChangesFromQs);
  const hundredsOfCommaSepIds = _.compose(
    _.map(
      _.compose(
        _.join(';'),
        _.map(_.iteratee('post_id'))
      )
    ),
    _.chunk(100)
  );

  const makeIdToRepMap = _.compose(
    _.spread(_.zipObject),
    _.unzip,
    _.map(_.over([_.iteratee('post_id'), _.iteratee('reputation_change')]))
  );

  const aIdToRep = makeIdToRepMap(repChangesFromAs);
  const qIdToRep = makeIdToRepMap(repChangesFromQs);

  // TODO: from here downward there's a lot of code duplication
  const tagRepFromQsWithAs = _.compose(
    _.reduce(_.mergeWith(_.add), {}),
    _.map(
      _.compose(
        _.fromPairs,
        ([tags, rep]) => _.zip(tags, Array(tags.length).fill(rep)),
        _.over([
          _.iteratee('tags'),
          _.compose(
            _.sum,
            _.map(x => aIdToRep[x]),
            _.filter(x => aIdToRep[x]),
            _.map(_.iteratee('answer_id')),
            _.iteratee('answers')
          )
        ])
      )
    )
  );

  const tagRepFromQs = _.compose(
    _.reduce(_.mergeWith(_.add), {}),
    _.map(
      _.compose(
        _.fromPairs,
        ([tags, rep]) => _.zip(tags, Array(tags.length).fill(rep)),
        _.over([
          _.iteratee('tags'),
          _.compose(x => qIdToRep[x], _.iteratee('question_id'))
        ])
      )
    )
  );

  return Promise.all([
    Promise.all(_.map(getQsWithAsFromAsIds, hundredsOfCommaSepIds(repChangesFromAs)))
    .then(_.flatten)
    .then(tagRepFromQsWithAs),
    Promise.all(_.map(getQsFromIds, hundredsOfCommaSepIds(repChangesFromQs)))
    .then(_.flatten)
    .then(tagRepFromQs)
  ])
    .then(x => {
      return _.reduce(_.mergeWith(_.add), {}, x);
    });
};

function populateSORadarPlot() {
  updateOrPickOld('AllRepChanges', getRepChanges)
    .then(repChanges => updateOrPickOld('RepByTag', () => repChangesToRepByTag(repChanges)))
    .finally(() => {
      const reputationByTagStr = localStorage.getItem('RepByTag');
      if (reputationByTagStr != null) {
        const repByTag = JSON.parse(reputationByTagStr);
        const entries = $('#radar-plot>.radar-plot').children();
        const tagNames = _.map(x => $(x).attr('title'), entries);
        const maxRep = _.max(_.map(tagName => repByTag[tagName], tagNames));
        const tagNamesShifted = rotate(1, tagNames);
        _.forEach(
          x => {
            const elem = x[0];
            const thisTagRep = repByTag[x[1]];
            const nextTagRep = repByTag[x[2]];
            elem.css('--this-skill', thisTagRep);
            elem.css('--next-skill', nextTagRep);
            elem.css('--max-skill', maxRep * 6/5);
          },
          _.zipAll([_.map(x => $(x).find('.from-stackoverflow'), entries), tagNames, tagNamesShifted])
        );
      }
    });
}
