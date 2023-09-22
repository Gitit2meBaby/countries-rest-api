document.addEventListener('DOMContentLoaded', () => {
    let jsonData;
    let countryNames = []; // Initialize an empty array to store country names


    async function fetchAPI() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            jsonData = await response.json();
            console.log('API loaded successfully:');


            // CREATE CARDS ON PAGE LOAD
            jsonData.forEach(item => {
                const cardContainer = document.getElementById('cardContainer');

                const card = document.createElement('div');
                card.innerHTML = cardTemplate(
                    item.name.common,
                    item.population,
                    item.region,
                    item.capital,
                    item.flags.png,
                    `${item.name.common} Flag`
                );

                cardContainer.appendChild(card);
            });

            // SEARCH BAR EVENT LISTENER
            const search = document.querySelector('#search');
            const suggestionContainer = document.querySelector('.suggestion-container')
            search.addEventListener('keyup', handleSearch)
            countryNames = jsonData.map(item => item.name.common);


            function handleSearch() {
                const inputValue = search.value.toLowerCase();
                const matchingCountries = countryNames.filter(country =>
                    country.toLowerCase().startsWith(inputValue)
                );

                // Clear any previous suggestions
                clearSuggestions();

                const suggestion = document.createElement('div');
                // Display matching country suggestions
                matchingCountries.forEach(countryName => {
                    const suggestionText = document.createElement('p')
                    suggestionText.textContent = countryName;
                    suggestion.classList.add('suggestion');

                    // Add a click event listener to select the suggestion
                    suggestionText.addEventListener('click', () => {
                        search.value = countryName;
                        clearSuggestions();
                    });

                    // Append the suggestion to a container
                    suggestion.appendChild(suggestionText)
                    suggestionContainer.appendChild(suggestion);

                    if (search.value == '') {
                        suggestionContainer.removeChild(suggestion)
                    }
                });
            }



            function clearSuggestions() {
                // Clear previous suggestions
                while (suggestionContainer.firstChild) {
                    suggestionContainer.removeChild(suggestionContainer.firstChild);
                }
            }

        } catch (error) {
            console.error('Error fetching API:', error);
        }
    }

    fetchAPI();
});

// CARD HTML TEMPLATE
const cardTemplate = (name, population, region, capital, flagSrc, flagAlt) => `
    <div class="card">
        <img src="${flagSrc}" alt="${flagAlt}">
        <div class="card-info">
            <h2>${name}</h2>
            <p>Population: <span>${population.toLocaleString()}</span></p>
            <p>Region: <span>${region}</span></p>
            <p>Capital: <span>${capital}</span></p>
        </div>
    </div>
`;













const lightModeMoon = document.querySelector('#lightModeMoon');
const darkModeMoon = document.querySelector('#darkModeMoon');
const modeText = document.querySelector('#modeText');


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