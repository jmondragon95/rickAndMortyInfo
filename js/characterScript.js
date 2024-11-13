//  Event Listeners

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (!isFetching && nextPage) {
            currentPage++;
            fetchCharacters(currentPage);
        }
    }
});

document.querySelector("#genderFilter").addEventListener("change", async() => {
    activeGenderFilter = document.querySelector("#genderFilter").value;
    filterCharacters();

    while (filteredCharacters.length < 15 && nextPage && !isFetching) {
        console.log("empty character container");
        currentPage++;
        await fetchCharacters(currentPage);
    }
})

document.querySelector("#numberOfCharacters").addEventListener("change", async() => {
    numberOfCharacters = document.querySelector("#numberOfCharacters").value;
    if (numberOfCharacters <= 0) {
        document.querySelector("#numberOfCharacters").style.borderColor = "red";
    }
    displayNumberOfCharacters(numberOfCharacters);
})


//  Global Variables

const characterContainer = document.querySelector("#characterContainer");
let allCharacters = [];
let filteredCharacters = [];
let currentPage = 1;
let nextPage = true;
let isFetching = false;
let activeGenderFilter = "all";

fetchCharacters(currentPage)

//  Functions

async function fetchCharacters(page) {
    if (isFetching) return;
    isFetching = true;
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();

        allCharacters = allCharacters.concat(data.results);

        filterCharacters();

        if (data.info.next == null) {
            nextPage = false;
        }
    } catch (error) {
        console.error("Error fetching characters:", error);
    } finally {
        isFetching = false;
    }
}

function displayCharacters(characters) {
    characterContainer.innerHTML = "";
    characters.forEach(character => {
        const characterCard = document.createElement("div");
        characterCard.className = "character";
        characterCard.innerHTML =
            `<img src="${character.image}" alt="${character.name}">
             <h3>${character.name}</h3>
             <p>Status: ${character.status}</p>
             <p>Species: ${character.species}</p>`;
        characterContainer.appendChild(characterCard);
    });
}

function displayNumberOfCharacters(numberOfCharacters) {
    characterContainer.innerHTML = "";
    for (let i = 0; i < numberOfCharacters; i++) {
        const characterCard = document.createElement("div");
        characterCard.className = "character";
        characterCard.innerHTML =
            `<img src="${allCharacters[i].image}" alt="${allCharacters[i].name}">
             <h3>${allCharacters[i].name}</h3>
             <p>Status: ${allCharacters[i].status}</p>
             <p>Species: ${allCharacters[i].species}</p>`;
        characterContainer.appendChild(characterCard);
    }
}

function filterCharacters() {
    if (activeGenderFilter === "all") {
        filteredCharacters = allCharacters;
    } else {
        filteredCharacters = allCharacters.filter(character => character.gender.toLowerCase() === activeGenderFilter);
    }
    displayCharacters(filteredCharacters);
}
