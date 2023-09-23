document.addEventListener('DOMContentLoaded', () => {
    let jsonData;
    let countryNames = [];
    let cards;
    chosenCountryGrid = document.querySelector('.chosen-country-grid');

    async function fetchAPI() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            jsonData = await response.json();
            console.log('API loaded successfully:');
            console.log('jsonData:', jsonData); // Log the entire jsonData array for inspection

            countryNames = jsonData.map(item => item.name.common);


            // CREATING ALL CARDS FROM JSON DATA AVAILABLE
            function createCards() {
                jsonData.forEach(item => {
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
            }

            createCards();
            cards = document.querySelectorAll('.card');


            // function to create the selected country page
            function createSelectedCountryElement(item) {
                const selectedCountryElement = document.createElement('div');

                // Parse JSON data into a usable format (and deal with outliers)
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
                    return '';
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
                );

                return selectedCountryElement;
            }

            // CREATE THE SEARCH DROPDOWN
            function createSuggestions() {
                const search = document.querySelector('#search');
                const suggestionContainer = document.querySelector('.suggestion-container');

                suggestionContainer.classList.add('suggestion');
                const inputValue = search.value.toLowerCase();
                const matchingCountries = countryNames.filter(country =>
                    country.toLowerCase().startsWith(inputValue)
                );

                clearSuggestions();

                matchingCountries.forEach((countryName, index) => {
                    const suggestionText = document.createElement('p');
                    suggestionText.textContent = countryName;
                    suggestionText.classList.add('suggestion-text');
                    suggestionContainer.appendChild(suggestionText);

                    // Add a click event listener to each suggestion
                    suggestionText.addEventListener('click', () => {
                        const chosenCountryGrid = document.querySelector('.chosen-country-grid')
                        const selectedItem = jsonData.find(item => item.name.common === countryName);
                        if (selectedItem) {
                            const selectedCountryElement = createSelectedCountryElement(selectedItem);
                            displaySelectedCountry(selectedCountryElement);
                            chosenCountryGrid.classList.remove('hidden');
                            chosenCountry.classList.remove('hidden');
                            chosenCountryGrid.innerHTML = '';
                            chosenCountryGrid.appendChild(selectedCountryElement);
                        }
                    });
                });
            }

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
                    clearSuggestions()
                }
            });
        }

        function clearSuggestions() {
            const suggestionContainer = document.querySelector('.suggestion-container');
            if (suggestionContainer.value == '') {
                suggestionContainer.classList.add('hidden')
            } else {
                suggestionContainer.classList.remove('hidden')
            }
            while (suggestionContainer.firstChild) {
                suggestionContainer.removeChild(suggestionContainer.firstChild);
            }
        }

        // HANDLE REGION FILTER WITH DROPDOWN
        const regionDropdown = document.querySelector('#dropdown');

        regionDropdown.addEventListener('change', () => {
            const selectedRegion = regionDropdown.value;

            // Remove all existing cards first
            function updateCards(selectedRegion) {
                while (cardContainer.firstChild) {
                    cardContainer.removeChild(cardContainer.firstChild);
                }
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
            regionDropdown.addEventListener('change', () => {
                const selectedRegion = regionDropdown.value;
                updateCards(selectedRegion);
                cards = document.querySelectorAll('.card');
            });
        });

        function createBorderButtons(jsonData, index, borderAlpha3Codes) {
            const currentCountry = jsonData[index];
            const buttonContainer = document.querySelector('.border-countries-btn-wrapper');

            // Create buttons for each bordering country
            borderAlpha3Codes.forEach((alpha3Code) => {
                const borderCountry = jsonData.find((country) => country.cca3 === alpha3Code);

                if (borderCountry) {
                    const button = document.createElement('button');
                    button.classList.add('primary-btn', 'border-btn');
                    button.textContent = borderCountry.name.common;
                    buttonContainer.appendChild(button);

                    button.addEventListener('click', () => {
                        const borderCountryIndex = jsonData.findIndex((country) => country.cca3 === alpha3Code);
                        console.log(borderCountryIndex);
                        if (borderCountryIndex !== -1) {
                            const borderCountry = jsonData[borderCountryIndex];
                            const selectedCountryElement = createSelectedCountryElement(borderCountry);
                            displaySelectedCountry(selectedCountryElement);
                            chosenCountryGrid.innerHTML = '';
                            chosenCountryGrid.appendChild(selectedCountryElement);
                            if (borderCountry.borders) {
                                createBorderButtons(jsonData, borderCountryIndex, borderCountry.borders);
                            }
                        }
                    });
                } else {
                    console.log(`No country found for alpha3Code: ${alpha3Code}`);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching API:', error);
    }
}

    fetchAPI();


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
const selectedCountryTemplate = (flagSrc, flagAlt, name, nativeName, population, region, subRegion, capital, topLevelDomain, currencies, languages, createBorderButtons) => `
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

// Attach the click event listener to the card container
const cardContainer = document.querySelector('.main-grid');
cardContainer.addEventListener('click', (event) => {
    // Check if a card was clicked
    const card = event.target.closest('.card');
    if (card) {
        const index = Array.from(cards).indexOf(card);
        if (index !== -1) {
            const item = jsonData[index];
            chosenCountryGrid = document.querySelector('.chosen-country-grid');
            const selectedCountryElement = createSelectedCountryElement(item);

            displaySelectedCountry(selectedCountryElement);
            chosenCountry.classList.remove('hidden');
            chosenCountryGrid.innerHTML = '';
            chosenCountryGrid.appendChild(selectedCountryElement);
            if (item.borders) {
                createBorderButtons(jsonData, index, item.borders);
            }
        }
    }
});

// BACK BUTTON TO RETURN TO HOME SCREEN
const back = document.querySelector('#back');
const mainPage = document.querySelector('.home');

back.addEventListener('click', () => {
    chosenCountry.classList.add('hidden');
    mainPage.classList.remove('hidden');

    // Hide the suggestion container when the back button is pressed
    const suggestionContainer = document.querySelector('.suggestion-container');
    suggestionContainer.classList.add('hidden');
    search.value = ''
});


// DARK THEME SWITCH
const lightModeMoon = document.querySelector('#lightModeMoon');
const darkModeMoon = document.querySelector('#darkModeMoon');
const modeSelector = document.querySelector('.dark-mode-wrapper');
const body = document.querySelector('.body')

modeSelector.addEventListener('click', () => {
    body.classList.toggle('light-theme')
    body.classList.toggle('dark-theme')
    lightModeMoon.classList.toggle('hidden')
    darkModeMoon.classList.toggle('hidden')
})

});
