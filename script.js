const episodesContainer = document.getElementById("episodes");
const searchInput = document.getElementById("searchInput");
const episodeSelect = document.getElementById("episodeSelect");
const episodeCount = document.getElementById("episodeCount");
const statusMessage = document.getElementById("statusMessage");

let episodes = [];

/* ---------- FETCH (LEVEL 300) ---------- */

fetch("https://api.tvmaze.com/shows/82/episodes")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }
    return response.json();
  })
  .then(function (data) {
    episodes = data;
    statusMessage.textContent = "";
    displayEpisodes(episodes);
    populateEpisodeSelect(episodes);
  })
  .catch(function () {
    statusMessage.textContent =
      "Sorry, episodes could not be loaded. Please try again later.";
  });

/* ---------- DISPLAY ---------- */

function displayEpisodes(episodeList) {
  episodesContainer.innerHTML = "";

  episodeList.forEach(function (episode) {
    const card = document.createElement("div");
    card.classList.add("episode-box");

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    card.innerHTML = `
      <h2 class="episode-name">${episode.name} - ${code}</h2>

      <img
        class="episode-image"
        src="${episode.image ? episode.image.medium : ""}"
        alt="${episode.name}"
      />

      <p><strong>Season:</strong> ${episode.season}</p>
      <p><strong>Episode:</strong> ${episode.number}</p>

      <p class="episode-summary">${episode.summary}</p>

      <p>
        <a
          class="episode-link"
          href="${episode.url}"
          target="_blank"
        >
          View on TVMaze
        </a>
      </p>
    `;

    episodesContainer.appendChild(card);
  });

  episodeCount.textContent = `Showing ${episodeList.length} episodes`;
}

/* ---------- LEVEL 200 FEATURES (UNCHANGED) ---------- */

// Live search
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredEpisodes = episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
    );
  });

  displayEpisodes(filteredEpisodes);
});

// Populate episode selector
function populateEpisodeSelect(episodeList) {
  episodeList.forEach(function (episode) {
    const option = document.createElement("option");

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    option.value = episode.id;
    option.textContent = `${code} - ${episode.name}`;

    episodeSelect.appendChild(option);
  });
}

// Selector behaviour
episodeSelect.addEventListener("change", function () {
  const selectedId = episodeSelect.value;

  if (selectedId === "") {
    displayEpisodes(episodes);
    return;
  }

  const selectedEpisode = episodes.find(function (episode) {
    return episode.id.toString() === selectedId;
  });

  displayEpisodes([selectedEpisode]);
});
