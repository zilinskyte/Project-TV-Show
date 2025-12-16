const showsContainer = document.getElementById("showsContainer");
const showSearchInput = document.getElementById("showSearchInput");
const searchInput = document.getElementById("searchInput");
const episodeSelect = document.getElementById("episodeSelect");
const episodesContainer = document.getElementById("episodes");
const statusMessage = document.getElementById("statusMessage");
const backToShows = document.getElementById("backToShows");

let showCache = [];
let episodeCache = {};
let currentEpisodes = [];

// Display episodes page
function displayEpisodes(episodes) {
  episodesContainer.innerHTML = "";

  episodes.forEach(ep => {
    const card = document.createElement("div");
    card.className = "episode-box";

    const season = ep.season.toString().padStart(2,"0");
    const number = ep.number.toString().padStart(2,"0");
    const code = `S${season}E${number}`;
    const summary = ep.summary?.replace(/<\/?p>/g,"") || "";

    card.innerHTML = `
      <h2>${ep.name} - ${code}</h2>
      <img src="${ep.image?.medium || ""}" alt="${ep.name}">
      <p>${summary}</p>
      <p><a href="${ep.url}" target="_blank">View on TVMaze</a></p>
    `;
    episodesContainer.appendChild(card);
  });

  statusMessage.textContent = `Showing ${episodes.length} episodes`;
}

// Populate episode selector
function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = `<option value="">Jump to an episode...</option>`;
  episodes.forEach(ep => {
    const season = ep.season.toString().padStart(2,"0");
    const number = ep.number.toString().padStart(2,"0");
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `S${season}E${number} - ${ep.name}`;
    episodeSelect.appendChild(option);
  });
}

// Fetch episodes, cache to avoid repeat requests
async function fetchEpisodes(showId) {
  if (episodeCache[showId]) return episodeCache[showId];

  try {
    statusMessage.textContent = "Loading episodes...";
    const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    const episodes = await res.json();
    episodeCache[showId] = episodes;
    return episodes;
  } catch {
    statusMessage.textContent = "Error loading episodes.";
    return [];
  }
}

// Go to episodes page for selected show
async function selectShow(showId) {
  showsContainer.style.display = "none";
  showSearchInput.style.display = "none";
  backToShows.style.display = "block";
  searchInput.style.display = "block";
  episodeSelect.style.display = "block";

  currentEpisodes = await fetchEpisodes(showId);
  displayEpisodes(currentEpisodes);
  populateEpisodeSelect(currentEpisodes);
}

// Back button
backToShows.addEventListener("click", () => {
  showsContainer.style.display = "grid";
  showSearchInput.style.display = "block";
  backToShows.style.display = "none";
  searchInput.style.display = "none";
  episodeSelect.style.display = "none";
  episodesContainer.innerHTML = "";
  statusMessage.textContent = "Select a show to view episodes";
});

// Episode search
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = currentEpisodes.filter(ep =>
    ep.name.toLowerCase().includes(term) ||
    (ep.summary?.toLowerCase().includes(term))
  );
  displayEpisodes(filtered);
});

// Episode selector
episodeSelect.addEventListener("change", () => {
  const id = episodeSelect.value;
  if (!id) displayEpisodes(currentEpisodes);
  else {
    const selected = currentEpisodes.find(ep => ep.id.toString() === id);
    displayEpisodes([selected]);
  }
});

// Fetch all shows for front page
async function fetchShows() {
  try {
    const res = await fetch("https://api.tvmaze.com/shows");
    const shows = await res.json();
    shows.sort((a,b)=> a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    showCache = shows;
    showsContainer.innerHTML = "";

    shows.forEach(show => {
      const card = document.createElement("div");
      card.className = "show-box";
      const summary = show.summary?.replace(/<\/?p>/g,"") || "";
      const genres = show.genres?.join(", ") || "";
      const rating = show.rating?.average || "N/A";

      card.innerHTML = `
        <h2 class="show-name">${show.name}</h2>
        <img src="${show.image?.medium || ""}" alt="${show.name}">
        <p>${summary.length>150 ? summary.slice(0,150)+"..." : summary}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Runtime:</strong> ${show.runtime || "N/A"} mins</p>
        <button class="read-more">Read more</button>
      `;

      card.querySelector(".read-more").addEventListener("click", () => {
        selectShow(show.id);
      });

      showsContainer.appendChild(card);
    });

    statusMessage.textContent = "Select a show to view episodes";
  } catch {
    statusMessage.textContent = "Error loading shows.";
  }
}

// Show search on front page
showSearchInput.addEventListener("input", () => {
  const term = showSearchInput.value.toLowerCase();
  const filtered = showCache.filter(show =>
    show.name.toLowerCase().includes(term) ||
    show.genres.join(" ").toLowerCase().includes(term) ||
    show.summary?.toLowerCase().includes(term)
  );

  showsContainer.innerHTML = "";
  filtered.forEach(show => {
    const card = document.createElement("div");
    card.className = "show-box";
    const summary = show.summary?.replace(/<\/?p>/g,"") || "";
    const genres = show.genres?.join(", ") || "";
    const rating = show.rating?.average || "N/A";

    card.innerHTML = `
      <h2 class="show-name">${show.name}</h2>
      <img src="${show.image?.medium || ""}" alt="${show.name}">
      <p>${summary.length>150 ? summary.slice(0,150)+"..." : summary}</p>
      <p><strong>Genres:</strong> ${genres}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${rating}</p>
      <p><strong>Runtime:</strong> ${show.runtime || "N/A"} mins</p>
      <button class="read-more">Read more</button>
    `;

    card.querySelector(".read-more").addEventListener("click", () => {
      selectShow(show.id);
    });

    showsContainer.appendChild(card);
  });
});

// Init
fetchShows();
