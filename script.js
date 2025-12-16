const showSelect = document.getElementById("showSelect");
const searchInput = document.getElementById("searchInput");
const episodeSelect = document.getElementById("episodeSelect");
const episodesContainer = document.getElementById("episodes");
const statusMessage = document.getElementById("statusMessage");

// Caches (VERY IMPORTANT for Level 400)
let showCache = [];
let episodeCache = {};
let currentEpisodes = [];

/* ------------------ RENDERING ------------------ */

function displayEpisodes(episodes) {
  episodesContainer.innerHTML = "";

  episodes.forEach(episode => {
    const card = document.createElement("div");
    card.className = "episode-box";

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    card.innerHTML = `
      <h2>${episode.name} - ${code}</h2>
      <img src="${episode.image ? episode.image.medium : ""}" alt="${episode.name}">
      <p>${episode.summary || ""}</p>
    `;

    episodesContainer.appendChild(card);
  });

  statusMessage.textContent = `Showing ${episodes.length} episodes`;
}

function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = `<option value="">Jump to an episode...</option>`;

  episodes.forEach(episode => {
    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");

    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${season}E${number} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

/* ------------------ FETCHING ------------------ */

async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    const shows = await response.json();

    // Alphabetical, case-insensitive
    shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    showCache = shows;

    showSelect.innerHTML = `<option value="">Select a show</option>`;

    shows.forEach(show => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });

    statusMessage.textContent = "Select a show to view episodes";
  } catch {
    statusMessage.textContent = "Error loading shows.";
  }
}

async function fetchEpisodes(showId) {
  if (episodeCache[showId]) {
    return episodeCache[showId];
  }

  try {
    statusMessage.textContent = "Loading episodes...";
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    const episodes = await response.json();

    episodeCache[showId] = episodes;
    return episodes;
  } catch {
    statusMessage.textContent = "Error loading episodes.";
    return [];
  }
}

/* ------------------ EVENTS ------------------ */

showSelect.addEventListener("change", async () => {
  const showId = showSelect.value;
  if (!showId) return;

  currentEpisodes = await fetchEpisodes(showId);
  displayEpisodes(currentEpisodes);
  populateEpisodeSelect(currentEpisodes);
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();

  const filtered = currentEpisodes.filter(ep =>
    ep.name.toLowerCase().includes(term) ||
    (ep.summary && ep.summary.toLowerCase().includes(term))
  );

  displayEpisodes(filtered);
});

episodeSelect.addEventListener("change", () => {
  const id = episodeSelect.value;
  if (!id) {
    displayEpisodes(currentEpisodes);
    return;
  }

  const selected = currentEpisodes.find(ep => ep.id.toString() === id);
  displayEpisodes([selected]);
});

/* ------------------ INIT ------------------ */

fetchShows();
