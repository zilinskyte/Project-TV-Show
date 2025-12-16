const episodes = getAllEpisodes();
const episodesContainer = document.getElementById("episodes");
const searchInput = document.getElementById("searchInput");
const episodeSelect = document.getElementById("episodeSelect");
const episodeCount = document.getElementById("episodeCount");

// Original loop moved into a function (minimal refactor)
function displayEpisodes(episodeList) {
  episodesContainer.innerHTML = "";

  episodeList.forEach(function (episode) {
    const card = document.createElement("div");
    card.classList.add("episode-box");

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    // Original innerHTML preserved
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

// Initial render (same behaviour as before)
displayEpisodes(episodes);

/* ---------- LEVEL 200 ADDITIONS ---------- */

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
episodes.forEach(function (episode) {
  const option = document.createElement("option");

  const season = episode.season.toString().padStart(2, "0");
  const number = episode.number.toString().padStart(2, "0");
  const code = `S${season}E${number}`;

  option.value = episode.id;
  option.textContent = `${code} - ${episode.name}`;

  episodeSelect.appendChild(option);
});

// Selector behaviour (bonus: show only selected episode)
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
