//  Event Listeners

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (!isFetching && nextPage){
            currentPage++;
            fetchLocations(currentPage);
        }
    }
});

//  Global Variables

const locationContainer = document.querySelector("#locationContainer");
let currentPage = 1;
let nextPage = true;
let isFetching = false;

fetchLocations(currentPage)

//  Functions

async function fetchLocations(page) {
    if (isFetching) return;
    isFetching = true;

    try {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
        const data = await response.json();

        await displayLocations(data.results);

        if (data.info.next == null) {
            nextPage = false;
        }
    } catch (error) {
        console.error("Error fetching locations:", error);
    } finally {
        isFetching = false;
    }
}

async function displayLocations(locations) {
    for (const location of locations) {
        const locationCard = document.createElement("div");
        locationCard.className = "location"
        const residentImageURLS = [];

        const maxResidents = 3;
        for (let i = 0; i < Math.min(location.residents.length, maxResidents); i++){
            try {
                const response = await fetch(location.residents[i]);
                const data = await response.json();
                residentImageURLS.push(data.image);
            } catch (error) {
                console.error("Error fetching resident data:", error);
            }
        }

        locationCard.innerHTML = `
            <h3>${location.name}</h3>
            <div class="resident-images">
                <!-- Loop through residentImageURLS and display images -->
                ${residentImageURLS.map((imageURL, index) => {
            return `<img src="${imageURL}" alt="Resident ${index + 1}">`;
        }).join('')}
            </div>
            <p>Type: ${location.type}</p>
            <p>Dimension: ${location.dimension}</p>
        `;

        // Append the location card to the container
        locationContainer.appendChild(locationCard);
    }
}