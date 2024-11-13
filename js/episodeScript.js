//  Event Listeners

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (!isFetching && nextPage){
            currentPage++;
            fetchEpisodes(currentPage);
        }
    }
});

//  Global Variables

const episodeContainer = document.querySelector("#episodeContainer");
let currentPage = 1;
let nextPage = true;
let isFetching = false;

fetchEpisodes(currentPage)

//  Functions

async function fetchEpisodes(page) {
    if (isFetching) return;
    isFetching = true;
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
        const data = await response.json();

        await displayEpisodes(data.results);

        if (data.info.next == null) {
            nextPage = false;
        }
    } catch (error) {
        console.error("Error fetching episodes:", error);
    } finally {
        isFetching = false;
    }
}

async function displayEpisodes(episodes) {
    for (const episode of episodes) {
        const episodeCard = document.createElement("div");
        episodeCard.className = "episode"
        const characterImageURLS = [];
        const maxCharacters = 3;
        for (let i = 0; i < Math.min(episode.characters.length, maxCharacters); i++){
            try {
                const response = await fetch(episode.characters[i]);
                const data = await response.json();
                characterImageURLS.push(data.image);
            } catch (error) {
                console.error("Error fetching characters in episode data:", error);
            }
        }

        episodeCard.innerHTML = `
            <h3>${episode.name}</h3>
            <div class="episode-character-images">
                <!-- Loop through residentImageURLS and display images -->
                ${characterImageURLS.map((imageURL, index) => {
            return `<img src="${imageURL}" alt="Character ${index + 1}">`;
        }).join('')}
            </div>
            <p>${episode.episode}</p>
            <p>Air Date: ${episode.air_date}</p>
        `;

        // Append the episode card to the container
        episodeContainer.appendChild(episodeCard);
    }
}