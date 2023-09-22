document.addEventListener('DOMContentLoaded', () => {
    let jsonData;
    let countryNames = [];


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

            // ADD AN EVENTLISTENER TO EACH CARD
            const cards = document.querySelectorAll('.card')
            cards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    const item = jsonData[index];
                    console.log(jsonData[index])
                    const chosenCountryGrid = document.querySelector('.chosen-country-grid');
                    const chosenCountry = document.querySelector('#chosenCountry');

                    // Create a new DOM element for selectedCountryHTML
                    const selectedCountryElement = document.createElement('div');

                    //Parse JSON data into a useable format
                    const languages = Object.keys(item.languages).map(languageCode => {
                        return item.languages[languageCode];
                    }).join(', ');

                    const currencies = item.currencies ? Object.keys(item.currencies).map(currencyCode => {
                        const currency = item.currencies[currencyCode];
                        return `${currency.name} (${currency.symbol})`;
                    }).join(', ') : 'N/A';

                    const nativeName = getOfficialNativeName(item.name.nativeName);
                    function getOfficialNativeName(nativeName) {
                        for (const langCode in nativeName) {
                            if (nativeName[langCode].official) {
                                return nativeName[langCode].official;
                            }
                        }
                        return ''; // Return an empty string if not found
                    }


                    selectedCountryElement.innerHTML = selectedCountryTemplate(
                        item.flags.png,
                        `${item.name.common} Flag`,
                        item.name.common,
                        nativeName || 'N/A',
                        item.population || 'N/A',
                        item.region || 'N/A',
                        item.subregion || 'N/A',
                        item.capital || 'N/A',
                        item.tld.join(', ') || 'N/A',
                        currencies || 'N/A',
                        languages || 'N/A',
                        item.borderCountries
                    );

                    displaySelectedCountry(selectedCountryElement);
                    chosenCountry.classList.remove('hidden');

                    // Clear previous content in chosenCountryGrid
                    chosenCountryGrid.innerHTML = '';

                    // Append the new DOM element to chosenCountryGrid
                    chosenCountryGrid.appendChild(selectedCountryElement);
                });
            });


            // Function to display the selected country HTML 
            function displaySelectedCountry(selectedCountryElement) {
                const mainPage = document.querySelector('.home');
                mainPage.classList.add('hidden');
            }







            // SEARCH BAR EVENT LISTENER
            const search = document.querySelector('#search');
            const suggestionContainer = document.querySelector('.suggestion-container')
            search.addEventListener('keyup', handleSearch)
            countryNames = jsonData.map(item => item.name.common);

            // Handle arrow key events on the input field
            search.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    suggestionContainer.focus();
                }
            });

            function handleSearch() {
                const inputValue = search.value.toLowerCase();
                const matchingCountries = countryNames.filter(country =>
                    country.toLowerCase().startsWith(inputValue)
                );

                clearSuggestions();
                // creating the searchbar dropdown
                const suggestion = document.createElement('div');
                matchingCountries.forEach(countryName => {
                    const suggestionText = document.createElement('p')
                    suggestionText.textContent = countryName;
                    suggestionText.classList.add('suggestion-text')
                    suggestion.classList.add('suggestion');

                    suggestionText.addEventListener('click', () => {
                        search.value = countryName;
                        clearSuggestions();
                    });

                    suggestion.appendChild(suggestionText)
                    suggestionContainer.appendChild(suggestion);

                    if (search.value == '') {
                        suggestionContainer.removeChild(suggestion)
                    }
                });
            }

            function clearSuggestions() {
                while (suggestionContainer.firstChild) {
                    suggestionContainer.removeChild(suggestionContainer.firstChild);
                }
            }

            // Add an event listener to the new div
            suggestionContainer.addEventListener('keydown', handleKeyDown);

            // Initialize a variable to keep track of the currently selected suggestion
            let selectedSuggestionIndex = -1;
            let suggestions = document.querySelectorAll('suggestion-text')

            function handleKeyDown(event) {
                const suggestions = document.querySelectorAll('.suggestion');

                if (event.key === 'ArrowDown') {
                    selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestions.length;
                } else if (event.key === 'ArrowUp') {
                    selectedSuggestionIndex = (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                }
            }

            // Add a click event listener to handle suggestion selection
            suggestions.forEach((suggestion, index) => {
                suggestion.addEventListener('click', () => {
                    search.value = suggestion.textContent;
                    clearSuggestions();
                });
            });

            // HANDLE REGION FILTER WITH DROPDOWN
            const regionDropdown = document.querySelector('#dropdown');
            const cardContainer = document.getElementById('cardContainer');

            regionDropdown.addEventListener('change', () => {
                const selectedRegion = regionDropdown.value;

                // Remove all existing cards first
                while (cardContainer.firstChild) {
                    cardContainer.removeChild(cardContainer.firstChild);
                }

                jsonData.forEach(item => {
                    if (item.region === selectedRegion || selectedRegion === 'all') {
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
                    }
                });
            });

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

// SELECTED COUNTRY HTML TEMPLATE
const selectedCountryTemplate = (flagSrc, flagAlt, name, nativeName, population, region, subRegion, capital, topLevelDomain, currencies, languages, borderCountries) => `
<div class="flag-image">
                <img src="${flagSrc}" alt="${flagAlt}">
            </div>

            <div class="country-info">
                <div class="country-title">
                    <h2>${name}</h2>
                </div>

                <div class="stats">
                    <div>
                        <p>Native Name: <span>${nativeName}</span></p>
                        <p>Population: <span>${population.toLocaleString()}</span></p>
                        <p>Region: <span>${region}</span></p>
                        <p>Sub Region: <span>${subRegion}</span></p>
                        <p>Capital: <span>${capital}</span></p>
                    </div>
                    <div>
                        <p>Top Level Domain: <span>${topLevelDomain}</span></p>
                        <p>Currencies: <span>${currencies}</span></p>
                        <p>Languages: <span>${languages}</span></p>
                    </div>
                </div>

                <div class="border-countries">
                    <p>Border Countries:</p>
                    <div class="border-countries-btn-wrapper"></div>
                </div>
            </div>
`;













const lightModeMoon = document.querySelector('#lightModeMoon');
const darkModeMoon = document.querySelector('#darkModeMoon');
const modeText = document.querySelector('#modeText');


const dropdown = document.querySelector('#dropdown');

const back = document.querySelector('#back');

const borderCountriesBtnWrapper = document.querySelector('.border-countries-btn-wrapper');
