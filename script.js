const episodes = getAllEpisodes();
const episodesContainer = document.getElementById("episodes");

//loop through episodes and create cards
episodes.forEach(function (episode) {
  const card = document.createElement("div");
  const season = episode.season.toString().padStart(2, "0");
  const number = episode.number.toString().padStart(2, "0");
  const code = `S${season}E${number}`;

  //fill the card with episode data
  card.innerHTML = `
    <h2>${episode.name} - ${code}</h2>
    <img src="${episode.image ? episode.image.medium : ""}" alt="${
    episode.name
  }"/>
    <p><strong>Season:</strong> ${episode.season} </p>
    <p><strong>Episode:</strong> ${episode.number}</p>
    <p>${episode.summary}</p>
    <p><a href="${episode.url}" target="_blank">View on TVMaze</a></p>
  `;

  //add card to contained/page
  episodesContainer.appendChild(card);
});

window.onload = setup;
