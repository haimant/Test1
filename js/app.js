/**
 * PetServicesIndia — Application Logic
 * Handles: rendering, filtering, search, URL sync, UI interactions
 * Depends on: PSD (window global from data.js)
 */

(function (data) {
  'use strict';

  /* =========================================================
     STATE
     Single source of truth for all active filters/UI state
     ========================================================= */
  var state = {
    city:     '',       // empty = no city selected yet (show welcome)
    category: 'all',
    breed:    'all',
    search:   ''
  };

  /* =========================================================
     UTILITY HELPERS
     ========================================================= */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function $(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  function $$(selector, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(selector));
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  /* =========================================================
     FILTER ENGINE
     ========================================================= */
  function filterListings() {
    if (!state.city) return [];

    var q = state.search.toLowerCase().trim();

    return data.LISTINGS.filter(function (l) {
      // City filter
      if (l.city !== state.city) return false;

      // Category filter
      if (state.category !== 'all' && l.category !== state.category) return false;

      // Breed filter: listings tagged 'all' always pass through
      if (state.breed !== 'all') {
        var hasBreed = l.breeds.indexOf(state.breed) !== -1 || l.breeds.indexOf('all') !== -1;
        if (!hasBreed) return false;
      }

      // Text search
      if (q) {
        var haystack = [
          l.name,
          l.description,
          l.area,
          l.specialty,
          (l.badges || []).join(' ')
        ].join(' ').toLowerCase();
        if (haystack.indexOf(q) === -1) return false;
      }

      return true;
    });
  }

  /* =========================================================
     CATEGORY COUNTS
     Returns count of listings per category for the current city + breed + search,
     ignoring the category filter so tabs always show accurate cross-filter counts.
     ========================================================= */
  function getCounts() {
    var counts = { all: 0 };
    Object.keys(data.CATEGORIES).forEach(function (k) { counts[k] = 0; });

    if (!state.city) return counts;

    var q = state.search.toLowerCase().trim();

    data.LISTINGS.forEach(function (l) {
      if (l.city !== state.city) return;
      if (state.breed !== 'all') {
        var hasBreed = l.breeds.indexOf(state.breed) !== -1 || l.breeds.indexOf('all') !== -1;
        if (!hasBreed) return;
      }
      if (q) {
        var hay = [l.name, l.description, l.area, l.specialty, (l.badges || []).join(' ')].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return;
      }
      counts['all']++;
      if (counts[l.category] !== undefined) counts[l.category]++;
    });

    return counts;
  }

  /* =========================================================
     JSON-LD STRUCTURED DATA
     Injected dynamically so search engines see current results
     ========================================================= */
  function updateStructuredData(listings) {
    var cityInfo = state.city ? data.CITIES[state.city] : null;
    var catLabel = state.category === 'all'
      ? 'Pet Services'
      : (data.CATEGORIES[state.category] ? data.CATEGORIES[state.category].label : 'Pet Services');

    var items = listings.map(function (l, i) {
      var schemaType = 'LocalBusiness';
      if (l.category === 'vets') schemaType = 'VeterinaryCare';

      return {
        '@type':    'ListItem',
        position:   i + 1,
        item: {
          '@type':     schemaType,
          name:        l.name,
          description: l.description,
          url:         l.website,
          address: {
            '@type':          'PostalAddress',
            streetAddress:    l.address || l.area,
            addressLocality:  cityInfo ? cityInfo.name : '',
            addressRegion:    cityInfo ? cityInfo.state : '',
            addressCountry:   'IN'
          }
        }
      };
    });

    var cityName = cityInfo ? cityInfo.name : 'India';
    var schema = {
      '@context':    'https://schema.org',
      '@type':       'ItemList',
      name:          catLabel + ' in ' + cityName,
      description:   'Top-rated ' + catLabel.toLowerCase() + ' in ' + cityName + ', India',
      numberOfItems: listings.length,
      itemListElement: items
    };

    var el = document.getElementById('ld-itemlist');
    if (el) el.textContent = JSON.stringify(schema, null, 2);
  }

  /* =========================================================
     URL SYNC
     Read/write state to URL query params for shareable links
     ========================================================= */
  function syncURL() {
    var params = new URLSearchParams();
    if (state.city)                  params.set('city',     state.city);
    if (state.category !== 'all')    params.set('category', state.category);
    if (state.breed    !== 'all')    params.set('breed',    state.breed);
    if (state.search)                params.set('q',        state.search);
    var qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function readURL() {
    var params = new URLSearchParams(location.search);
    if (params.get('city') && data.CITIES[params.get('city')]) {
      state.city = params.get('city');
    }
    if (params.get('category') && (params.get('category') === 'all' || data.CATEGORIES[params.get('category')])) {
      state.category = params.get('category');
    }
    if (params.get('breed')) {
      state.breed = params.get('breed');
    }
    if (params.get('q')) {
      state.search = params.get('q');
    }
  }

  /* =========================================================
     RENDER — BADGES
     ========================================================= */
  function renderBadges(badgeKeys) {
    if (!badgeKeys || !badgeKeys.length) return '';
    return badgeKeys.map(function (key) {
      var b = data.BADGES[key];
      if (!b) return '';
      return '<span class="badge ' + b.cls + '">' + escapeHTML(b.label) + '</span>';
    }).join('');
  }

  /* =========================================================
     RENDER — SINGLE LISTING CARD
     ========================================================= */
  function renderCard(listing) {
    var cat = data.CATEGORIES[listing.category];
    var catLabel = cat ? cat.label : listing.category;
    var catIcon  = cat ? cat.icon  : '🐾';

    var websiteHTML = listing.website
      ? '<a href="' + escapeHTML(listing.website) + '" class="card-website" target="_blank" rel="noopener noreferrer" aria-label="Visit ' + escapeHTML(listing.name) + ' website">'
        + '<span class="web-icon" aria-hidden="true">🔗</span> ' + escapeHTML(listing.websiteLabel || listing.website)
        + '</a>'
      : '<span class="card-contact"><span aria-hidden="true">📞</span> Contact info TBD</span>';

    var phoneHTML = listing.phone
      ? '<span class="card-info-row"><span class="info-icon" aria-hidden="true">📞</span>' + escapeHTML(listing.phone) + '</span>'
      : '';

    var addressHTML = listing.address
      ? '<span class="card-info-row"><span class="info-icon" aria-hidden="true">📍</span>' + escapeHTML(listing.address) + '</span>'
      : '';

    var specialtyHTML = listing.specialty
      ? '<p class="card-specialty">' + escapeHTML(listing.specialty) + '</p>'
      : '';

    return [
      '<article class="listing-card" data-category="' + escapeHTML(listing.category) + '" data-id="' + escapeHTML(listing.id) + '" data-city="' + escapeHTML(listing.city) + '">',
      '  <div class="card-header">',
      '    <div class="card-rank" aria-label="Rank ' + listing.rank + '">#' + listing.rank + '</div>',
      '    <div class="card-title-wrap">',
      '      <h3 class="card-name">' + escapeHTML(listing.name) + '</h3>',
      '      <span class="card-category-label" aria-label="Category: ' + escapeHTML(catLabel) + '">' + catIcon + ' ' + escapeHTML(catLabel) + '</span>',
      '    </div>',
      '  </div>',
      listing.description ? '  <p class="card-description">' + escapeHTML(listing.description) + '</p>' : '',
      '  <div class="card-info">',
      addressHTML,
      phoneHTML,
      '  </div>',
      specialtyHTML,
      listing.badges && listing.badges.length
        ? '  <div class="card-badges" aria-label="Features">' + renderBadges(listing.badges) + '</div>'
        : '',
      '  <div class="card-footer">',
      websiteHTML,
      '  </div>',
      '</article>'
    ].filter(Boolean).join('\n');
  }

  /* =========================================================
     RENDER — CATEGORY SECTION HEADER
     (shown when viewing 'all' categories)
     ========================================================= */
  function renderSectionHeader(catKey, count) {
    var cat = data.CATEGORIES[catKey];
    if (!cat) return '';
    return [
      '<div class="category-section-header" id="section-' + catKey + '" aria-label="' + escapeHTML(cat.label) + ' section">',
      '  <span class="section-icon" aria-hidden="true">' + cat.icon + '</span>',
      '  <h2 class="section-title">' + escapeHTML(cat.label) + '</h2>',
      '  <span class="section-count">' + count + ' listed</span>',
      '</div>'
    ].join('\n');
  }

  /* =========================================================
     RENDER — WELCOME SCREEN (no city selected)
     ========================================================= */
  function renderWelcome() {
    var activeCities = [];
    Object.keys(data.CITIES).forEach(function (key) {
      var city = data.CITIES[key];
      if (city.active) {
        var count = data.LISTINGS.filter(function (l) { return l.city === key; }).length;
        activeCities.push({ key: key, name: city.name, emoji: city.emoji, state: city.state, count: count });
      }
    });

    var cardsHtml = activeCities.map(function (c) {
      return '<button class="welcome-city-card" data-city="' + c.key + '" aria-label="Browse pet services in ' + escapeHTML(c.name) + '">'
        + '<div class="welcome-city-emoji">' + c.emoji + '</div>'
        + '<div class="welcome-city-name">' + escapeHTML(c.name) + '</div>'
        + '<div class="welcome-city-state">' + escapeHTML(c.state) + '</div>'
        + '<div class="welcome-city-count">' + c.count + ' listings</div>'
        + '</button>';
    }).join('');

    return [
      '<div class="welcome-screen">',
      '  <div class="welcome-icon" aria-hidden="true">🐾</div>',
      '  <h2 class="welcome-title">Welcome to PetServicesIndia</h2>',
      '  <p class="welcome-subtitle">Select a city to discover trusted vets, dog trainers, groomers, boarding facilities, and pet food stores near you.</p>',
      '  <div class="welcome-cities-grid">' + cardsHtml + '</div>',
      '</div>'
    ].join('\n');
  }

  /* =========================================================
     RENDER — EMPTY STATE
     ========================================================= */
  function renderEmpty() {
    return [
      '<div class="empty-state">',
      '  <div class="empty-icon" aria-hidden="true">🔍</div>',
      '  <h3>No results found</h3>',
      '  <p>Try adjusting your filters or search terms to find pet services.</p>',
      '  <button class="empty-reset-btn" id="empty-reset-btn">',
      '    ✕ Clear all filters',
      '  </button>',
      '</div>'
    ].join('\n');
  }

  /* =========================================================
     RENDER — MAIN RENDER FUNCTION
     Called whenever state changes
     ========================================================= */
  function render() {
    var container  = document.getElementById('listings-grid');
    var countEl    = document.getElementById('results-count');

    // --- WELCOME STATE: no city selected ---
    if (!state.city) {
      // Hide category counts
      $$('.cat-tab').forEach(function (tab) {
        var countBadge = tab.querySelector('.cat-count');
        if (countBadge) countBadge.textContent = '0';
      });

      if (countEl) countEl.innerHTML = 'Select a city above to browse listings';
      renderActiveFilters();

      if (!container) return;
      container.innerHTML = renderWelcome();

      // Wire welcome city card clicks
      $$('.welcome-city-card', container).forEach(function (card) {
        card.addEventListener('click', function () {
          selectCity(card.dataset.city);
        });
      });

      updateStructuredData([]);
      syncURL();
      document.title = 'Pet Services Directory India | Vets, Trainers, Groomers, Boarding & Pet Shops';
      return;
    }

    // --- NORMAL STATE: city is selected ---
    var listings   = filterListings();
    var cityInfo   = data.CITIES[state.city];
    var cityName   = cityInfo ? cityInfo.name : state.city;

    // Update results count text
    if (countEl) {
      if (listings.length === 0) {
        countEl.innerHTML = 'No listings found in <strong>' + escapeHTML(cityName) + '</strong>';
      } else {
        countEl.innerHTML = 'Showing <strong>' + listings.length + '</strong> listing' +
          (listings.length !== 1 ? 's' : '') + ' in <strong>' + escapeHTML(cityName) + '</strong>';
      }
    }

    // Update category tab counts
    var counts = getCounts();
    $$('.cat-tab').forEach(function (tab) {
      var catKey = tab.dataset.category;
      var countBadge = tab.querySelector('.cat-count');
      if (countBadge && counts[catKey] !== undefined) {
        countBadge.textContent = counts[catKey];
      }
    });

    // Update active filter chips
    renderActiveFilters();

    // Render listings
    if (!container) return;

    if (listings.length === 0) {
      container.innerHTML = renderEmpty();
      var emptyReset = document.getElementById('empty-reset-btn');
      if (emptyReset) emptyReset.addEventListener('click', resetAllFilters);
      updateStructuredData([]);
      syncURL();
      return;
    }

    var html = '';

    if (state.category === 'all') {
      // Group by category, show section headers
      var catOrder = ['vets', 'trainers', 'groomers', 'boarding', 'petfood'];
      catOrder.forEach(function (catKey) {
        var catListings = listings.filter(function (l) { return l.category === catKey; });
        if (!catListings.length) return;
        html += renderSectionHeader(catKey, catListings.length);
        catListings.forEach(function (l) { html += renderCard(l); });
      });
    } else {
      listings.forEach(function (l) { html += renderCard(l); });
    }

    container.innerHTML = html;

    // Update structured data
    updateStructuredData(listings);

    // Sync URL
    syncURL();

    // Update page title
    updatePageTitle(listings.length, cityName);
  }

  /* =========================================================
     UPDATE PAGE TITLE DYNAMICALLY
     ========================================================= */
  function updatePageTitle(count, cityName) {
    var catLabel = state.category === 'all'
      ? 'Pet Services'
      : (data.CATEGORIES[state.category] ? data.CATEGORIES[state.category].label : 'Pet Services');
    document.title = catLabel + ' in ' + cityName + ' | PetServicesIndia';
  }

  /* =========================================================
     ACTIVE FILTER CHIPS
     ========================================================= */
  function renderActiveFilters() {
    var container = document.getElementById('active-filters');
    if (!container) return;

    var chips = [];

    if (state.category !== 'all') {
      var cat = data.CATEGORIES[state.category];
      chips.push({
        label: cat ? (cat.icon + ' ' + cat.label) : state.category,
        resetFn: function () {
          state.category = 'all';
          syncCategoryUI();
          render();
        }
      });
    }

    if (state.breed !== 'all') {
      var breedTag = data.BREED_TAGS.filter(function (b) { return b.value === state.breed; })[0];
      chips.push({
        label: breedTag ? (breedTag.icon + ' ' + breedTag.label) : state.breed,
        resetFn: function () {
          state.breed = 'all';
          syncBreedUI();
          render();
        }
      });
    }

    if (chips.length === 0) {
      container.innerHTML = '';
      return;
    }

    var html = chips.map(function (chip, i) {
      return '<span class="active-filter-chip">' +
        escapeHTML(chip.label) +
        '<button data-chip-index="' + i + '" aria-label="Remove filter">×</button>' +
        '</span>';
    }).join('');

    // Add "clear all" if more than 1 filter
    if (chips.length > 1) {
      html += '<button class="active-filter-chip" id="clear-all-filters" style="cursor:pointer;background:var(--bg-alt);color:var(--text-muted);">Clear all ×</button>';
    }

    container.innerHTML = html;

    // Bind chip remove buttons
    $$('[data-chip-index]', container).forEach(function (btn) {
      var idx = parseInt(btn.dataset.chipIndex, 10);
      btn.addEventListener('click', function () {
        chips[idx].resetFn();
      });
    });

    var clearAll = document.getElementById('clear-all-filters');
    if (clearAll) clearAll.addEventListener('click', resetAllFilters);
  }

  /* =========================================================
     RESET FILTERS
     ========================================================= */
  function resetAllFilters() {
    state.category = 'all';
    state.breed    = 'all';
    state.search   = '';

    var searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    var searchClear = document.getElementById('search-clear');
    if (searchClear) searchClear.classList.remove('visible');

    syncCategoryUI();
    syncBreedUI();
    render();
  }

  /* =========================================================
     UI SYNC HELPERS
     Update active states on filter buttons without re-rendering
     ========================================================= */
  function syncCategoryUI() {
    $$('.cat-tab').forEach(function (tab) {
      var isActive = tab.dataset.category === state.category;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    $$('.filter-option[data-filter="category"]').forEach(function (opt) {
      var isActive = opt.dataset.value === state.category;
      opt.classList.toggle('active', isActive);
    });
    $$('#mobile-filter-form .filter-option[data-filter="category"]').forEach(function (opt) {
      var isActive = opt.dataset.value === state.category;
      opt.classList.toggle('active', isActive);
    });
  }

  function syncBreedUI() {
    $$('.filter-option[data-filter="breed"]').forEach(function (opt) {
      var isActive = opt.dataset.value === state.breed;
      opt.classList.toggle('active', isActive);
    });
    $$('#mobile-filter-form .filter-option[data-filter="breed"]').forEach(function (opt) {
      var isActive = opt.dataset.value === state.breed;
      opt.classList.toggle('active', isActive);
    });
  }

  /* =========================================================
     BUILD SIDEBAR FILTER UI
     ========================================================= */
  function buildSidebarFilters() {
    var catContainer = document.getElementById('sidebar-category-filters');
    var breedContainer = document.getElementById('sidebar-breed-filters');

    if (catContainer) {
      var catHtml = '<button class="filter-option active" data-filter="category" data-value="all" aria-pressed="true">'
        + '<span class="opt-icon">🐾</span> All Services'
        + '<span class="opt-count" id="sidebar-count-all">0</span>'
        + '</button>';

      Object.keys(data.CATEGORIES).forEach(function (key) {
        var cat = data.CATEGORIES[key];
        catHtml += '<button class="filter-option" data-filter="category" data-value="' + key + '" aria-pressed="false">'
          + '<span class="opt-icon">' + cat.icon + '</span> ' + escapeHTML(cat.label)
          + '<span class="opt-count" id="sidebar-count-' + key + '">0</span>'
          + '</button>';
      });

      catContainer.innerHTML = catHtml;
    }

    if (breedContainer) {
      var breedHtml = '';
      data.BREED_TAGS.forEach(function (breed) {
        var isActive = breed.value === 'all';
        breedHtml += '<button class="filter-option' + (isActive ? ' active' : '') + '" data-filter="breed" data-value="' + breed.value + '" aria-pressed="' + isActive + '">'
          + '<span class="opt-icon">' + breed.icon + '</span> ' + escapeHTML(breed.label)
          + '</button>';
      });
      breedContainer.innerHTML = breedHtml;
    }
  }

  /* =========================================================
     BUILD MOBILE FILTER SHEET
     ========================================================= */
  function buildMobileFilters() {
    var catContainer = document.getElementById('mobile-category-filters');
    var breedContainer = document.getElementById('mobile-breed-filters');

    if (catContainer) {
      var catHtml = '<button class="filter-option active" data-filter="category" data-value="all" aria-pressed="true">'
        + '<span class="opt-icon">🐾</span> All Services</button>';
      Object.keys(data.CATEGORIES).forEach(function (key) {
        var cat = data.CATEGORIES[key];
        catHtml += '<button class="filter-option" data-filter="category" data-value="' + key + '" aria-pressed="false">'
          + '<span class="opt-icon">' + cat.icon + '</span> ' + escapeHTML(cat.label) + '</button>';
      });
      catContainer.innerHTML = catHtml;
    }

    if (breedContainer) {
      var breedHtml = '';
      data.BREED_TAGS.forEach(function (breed) {
        var isActive = breed.value === 'all';
        breedHtml += '<button class="filter-option' + (isActive ? ' active' : '') + '" data-filter="breed" data-value="' + breed.value + '" aria-pressed="' + isActive + '">'
          + '<span class="opt-icon">' + breed.icon + '</span> ' + escapeHTML(breed.label) + '</button>';
      });
      breedContainer.innerHTML = breedHtml;
    }
  }

  /* =========================================================
     BUILD CITIES SECTION
     ========================================================= */
  function buildCitiesSection() {
    var grid = document.getElementById('cities-grid');
    if (!grid) return;

    var html = '';
    Object.keys(data.CITIES).forEach(function (key) {
      var city = data.CITIES[key];
      var isActive = key === state.city;
      var cls = 'city-card ' + (isActive ? 'active-city' : (city.active ? '' : 'coming-soon'));
      var statusText = isActive ? 'Currently Viewing' : (city.active ? 'Available' : 'Coming Soon');

      if (city.active && !isActive) {
        html += '<button class="' + cls + '" data-switch-city="' + key + '" aria-label="View pet services in ' + escapeHTML(city.name) + '">'
          + '<div class="city-emoji">' + city.emoji + '</div>'
          + '<div class="city-name">' + escapeHTML(city.name) + '</div>'
          + '<div class="city-status">' + statusText + '</div>'
          + '</button>';
      } else {
        html += '<div class="' + cls + '">'
          + '<div class="city-emoji">' + city.emoji + '</div>'
          + '<div class="city-name">' + escapeHTML(city.name) + '</div>'
          + '<div class="city-status">' + statusText + '</div>'
          + '</div>';
      }
    });

    grid.innerHTML = html;

    // Wire city card click handlers
    $$('[data-switch-city]', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectCity(btn.dataset.switchCity);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* =========================================================
     BUILD BANNER STATS
     ========================================================= */
  function buildBannerStats() {
    var statsEl = document.getElementById('banner-stats');
    if (!statsEl) return;

    if (!state.city) {
      // Welcome state — show aggregate stats
      var totalListings = data.LISTINGS.length;
      var activeCityCount = Object.keys(data.CITIES).filter(function (k) { return data.CITIES[k].active; }).length;
      var catCount = Object.keys(data.CATEGORIES).length;

      statsEl.innerHTML = [
        '<div class="stat-item"><div class="stat-value">' + totalListings + '</div><div class="stat-label">Total Listings</div></div>',
        '<div class="stat-item"><div class="stat-value">' + activeCityCount + '</div><div class="stat-label">Cities Live</div></div>',
        '<div class="stat-item"><div class="stat-value">' + catCount + '</div><div class="stat-label">Categories</div></div>'
      ].join('');
      return;
    }

    var cityListings = data.LISTINGS.filter(function (l) { return l.city === state.city; });
    var counts = {};
    cityListings.forEach(function (l) {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });

    var stats = [
      { value: cityListings.length, label: 'Total Listings' },
      { value: counts['vets'] || 0, label: 'Vet Clinics' },
      { value: (counts['trainers'] || 0) + (counts['groomers'] || 0), label: 'Trainers & Groomers' },
      { value: counts['boarding'] || 0, label: 'Boarding Options' }
    ];

    statsEl.innerHTML = stats.map(function (s) {
      return '<div class="stat-item">'
        + '<div class="stat-value">' + s.value + '</div>'
        + '<div class="stat-label">' + escapeHTML(s.label) + '</div>'
        + '</div>';
    }).join('');
  }

  /* =========================================================
     BUILD BANNER H1 / SUBTITLE
     ========================================================= */
  function buildBannerText() {
    var h1 = document.getElementById('banner-h1');
    var sub = document.getElementById('banner-subtitle');

    if (!state.city) {
      // Welcome state — no city selected
      if (h1) h1.innerHTML = 'India\'s Pet Services <span>Directory</span>';
      if (sub) sub.textContent = 'Find trusted vets, trainers, groomers, boarding, and pet food stores across India. Select a city to get started.';
      return;
    }

    var cityInfo = data.CITIES[state.city];
    if (h1 && cityInfo) {
      h1.innerHTML = 'Top Pet Services in <span>' + escapeHTML(cityInfo.name) + '</span>';
    }
    if (sub && cityInfo) {
      sub.textContent = 'Find trusted vets, trainers, groomers, boarding, and pet food stores in ' +
        cityInfo.name + ', ' + cityInfo.state + '.';
    }
  }

  /* =========================================================
     CITY SELECTOR
     ========================================================= */
  function buildCitySelector() {
    var sel = document.getElementById('city-select');
    if (!sel) return;

    var html = '';

    // Placeholder option when no city is selected
    if (!state.city) {
      html += '<option value="" selected disabled>Select a City</option>';
    }

    Object.keys(data.CITIES).forEach(function (key) {
      var city = data.CITIES[key];
      if (!city.active) return;
      html += '<option value="' + key + '"' + (key === state.city ? ' selected' : '') + '>'
        + city.emoji + ' ' + escapeHTML(city.name)
        + '</option>';
    });
    sel.innerHTML = html;
  }

  /* =========================================================
     SELECT CITY — Central function for switching cities
     Called from: city selector dropdown, welcome cards, city section cards
     ========================================================= */
  function selectCity(cityKey) {
    if (!cityKey || !data.CITIES[cityKey]) return;

    state.city = cityKey;

    // Update the dropdown to reflect the new city
    var sel = document.getElementById('city-select');
    if (sel) {
      // Remove placeholder option if it exists
      var placeholder = sel.querySelector('option[value=""]');
      if (placeholder) placeholder.remove();
      sel.value = cityKey;
    }

    // Update banner, stats, city cards
    buildBannerText();
    buildBannerStats();
    buildCitiesSection();

    // Re-render listings
    render();

    // Scroll to top of listings on mobile
    if (window.innerWidth < 1024) {
      var mainEl = document.getElementById('main-content');
      if (mainEl) mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* =========================================================
     EVENT LISTENERS
     ========================================================= */
  function wireEvents() {
    // ---- Category tabs (top nav) ----
    document.addEventListener('click', function (e) {
      var tab = e.target.closest('.cat-tab');
      if (tab) {
        state.category = tab.dataset.category;
        syncCategoryUI();
        render();
        // Smooth scroll to listings on mobile
        if (window.innerWidth < 1024) {
          var listEl = document.getElementById('main-content');
          if (listEl) listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      // ---- Sidebar / mobile filter buttons ----
      var filterBtn = e.target.closest('.filter-option[data-filter]');
      if (filterBtn) {
        var filterType = filterBtn.dataset.filter;
        var filterVal  = filterBtn.dataset.value;

        if (filterType === 'category') {
          state.category = filterVal;
          syncCategoryUI();
        } else if (filterType === 'breed') {
          state.breed = filterVal;
          syncBreedUI();
        }
        render();

        // Close mobile sheet after selection
        var overlay = document.getElementById('filter-overlay');
        if (overlay) overlay.classList.remove('open');
        return;
      }

      // ---- Mobile filter sheet open ----
      var mobileFilterBtn = e.target.closest('#mobile-filter-btn');
      if (mobileFilterBtn) {
        var overlay2 = document.getElementById('filter-overlay');
        if (overlay2) overlay2.classList.toggle('open');
        return;
      }

      // ---- Close filter sheet ----
      var closeBtn = e.target.closest('#filter-sheet-close') || e.target.closest('#filter-overlay');
      if (closeBtn && !e.target.closest('.filter-sheet')) {
        var overlay3 = document.getElementById('filter-overlay');
        if (overlay3) overlay3.classList.remove('open');
        return;
      }

      // ---- Back to top ----
      var bttBtn = e.target.closest('#back-to-top');
      if (bttBtn) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    });

    // ---- City selector ----
    var citySelect = document.getElementById('city-select');
    if (citySelect) {
      citySelect.addEventListener('change', function () {
        selectCity(this.value);
      });
    }

    // ---- Search input ----
    var searchInput = document.getElementById('search-input');
    var searchClear = document.getElementById('search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function () {
        state.search = searchInput.value;
        if (searchClear) {
          searchClear.classList.toggle('visible', !!searchInput.value);
        }
        render();
      }, 280));
    }
    if (searchClear) {
      searchClear.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        state.search = '';
        searchClear.classList.remove('visible');
        searchInput && searchInput.focus();
        render();
      });
    }

    // ---- Back to top button visibility ----
    var bttBtn = document.getElementById('back-to-top');
    if (bttBtn) {
      window.addEventListener('scroll', debounce(function () {
        bttBtn.classList.toggle('visible', window.scrollY > 400);
      }, 100));
    }

    // ---- Filter reset link in sidebar ----
    var filterReset = document.getElementById('filter-reset-btn');
    if (filterReset) {
      filterReset.addEventListener('click', function () {
        resetAllFilters();
      });
    }

    // ---- Footer city links (use JS instead of page reload) ----
    $$('[data-city-link]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        selectCity(link.dataset.cityLink);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* =========================================================
     UPDATE SIDEBAR COUNTS (called after render)
     ========================================================= */
  function updateSidebarCounts() {
    var counts = getCounts();
    Object.keys(counts).forEach(function (key) {
      var el = document.getElementById('sidebar-count-' + key);
      if (el) el.textContent = counts[key];
    });
  }

  // Wrap render to also update sidebar counts
  var originalRender = render;
  render = function () {
    originalRender();
    updateSidebarCounts();
  };

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    // Read URL params first to restore state
    readURL();

    // Build dynamic UI from data
    buildCitySelector();
    buildSidebarFilters();
    buildMobileFilters();
    buildBannerText();
    buildBannerStats();
    buildCitiesSection();

    // Sync UI to state from URL
    syncCategoryUI();
    syncBreedUI();

    // Set search input value if from URL
    var searchInput = document.getElementById('search-input');
    if (searchInput && state.search) {
      searchInput.value = state.search;
      var sc = document.getElementById('search-clear');
      if (sc) sc.classList.add('visible');
    }

    // Wire all events
    wireEvents();

    // Initial render
    render();
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(PSD);
