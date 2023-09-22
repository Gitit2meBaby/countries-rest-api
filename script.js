document.addEventListener('DOMContentLoaded', () => {
    let jsonData;

    async function fetchAPI() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            jsonData = await response.json();
            console.log('API loaded successfully:');

            // Create cards here, inside the fetchAPI function
            const cardContainer = document.getElementById('cardContainer');
            jsonData.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');

                const cardImage = document.createElement('img');
                cardImage.src = item.flags.png;
                cardImage.alt = `${item.name.common} Flag`;

                const cardInfo = document.createElement('div');
                cardInfo.classList.add('card-info');

                const cardTitle = document.createElement('h2');
                cardTitle.textContent = item.name.common;

                const population = document.createElement('p');
                population.textContent = `Population: ${item.population}`;

                const region = document.createElement('p');
                region.textContent = `Region: ${item.region}`;

                const capital = document.createElement('p');
                capital.textContent = `Capital: ${item.capital}`;

                // Append elements to the card
                cardInfo.appendChild(cardTitle);
                cardInfo.appendChild(population);
                cardInfo.appendChild(region);
                cardInfo.appendChild(capital);

                card.appendChild(cardImage);
                card.appendChild(cardInfo);

                // Append the card to the container
                cardContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching API:', error);
        }
    }

    fetchAPI();
});


const lightModeMoon = document.querySelector('#lightModeMoon');
const darkModeMoon = document.querySelector('#darkModeMoon');
const modeText = document.querySelector('#modeText');

const search = document.querySelector('#search');

const dropdown = document.querySelector('#dropdown');

const back = document.querySelector('#back');

const borderCountriesBtnWrapper = document.querySelector('.border-countries-btn-wrapper');



// const chosenCountry = document.querySelector('#chosenCountry');
// const chosenCountryName = document.querySelector('#chosenCountryName');
// const nativeName = document.querySelector('#nativeName');
// const population = document.querySelector('#population');
// const region = document.querySelector('#region');
// const subRegion = document.querySelector('#subRegion');
// const capital = document.querySelector('#capital');
// const topLevelDomain = document.querySelector('#topLevelDomain');
// const currencies = document.querySelector('#currencies');
// const languages = document.querySelector('#languages');

// const populationCard = document.querySelector('#populationCard');
// const regionCard = document.querySelector('#regionCard');
// const capitalCard = document.querySelector('#capitalCard');