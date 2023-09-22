document.addEventListener('DOMContentLoaded', () => {
    let jsonData;
    let countryNames = [];
    let cards;

    async function fetchAPI() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            jsonData = await response.json();
            console.log('API loaded successfully:');
            console.log('jsonData:', jsonData); // Log the entire jsonData array for inspection

            countryNames = jsonData.map(item => item.name.common);

            // CREATE CARDS ON PAGE LOAD
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

            createCards()
            cards = document.querySelectorAll('.card'); // Assign cards here


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

            //event listener when clicking on a card
            cards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    const item = jsonData[index];
                    chosenCountryGrid = document.querySelector('.chosen-country-grid')
                    const selectedCountryElement = createSelectedCountryElement(item);


                    displaySelectedCountry(selectedCountryElement);
                    chosenCountry.classList.remove('hidden');
                    chosenCountryGrid.innerHTML = '';
                    chosenCountryGrid.appendChild(selectedCountryElement);
                    if (item.borders) {
                        createBorderButtons(jsonData, index, item.borders);
                    }
                });
            });


            // Function to display the selected country HTML 
            const mainPage = document.querySelector('.home');
            function displaySelectedCountry(selectedCountryElement) {
                mainPage.classList.add('hidden');
            }

            function createSuggestions() {
                const search = document.querySelector('#search');
                const suggestionContainer = document.querySelector('.suggestion-container');
                suggestionContainer.classList.add('suggestion')
                const inputValue = search.value.toLowerCase();
                const matchingCountries = countryNames.filter(country =>
                    country.toLowerCase().startsWith(inputValue)
                );

                clearSuggestions();

                matchingCountries.forEach((countryName, index) => {
                    const suggestionText = document.createElement('p');
                    const chosenCountryGrid = document.querySelector('.chosen-country-grid')
                    suggestionText.textContent = countryName;
                    suggestionText.classList.add('suggestion-text');
                    suggestionContainer.appendChild(suggestionText);


                    // Add a click event listener to each suggestion
                    suggestionText.addEventListener('click', () => {
                        const item = jsonData[index];
                        const selectedCountryElement = createSelectedCountryElement(item);

                        displaySelectedCountry(selectedCountryElement);
                        chosenCountryGrid.classList.remove('hidden');
                        chosenCountry.classList.remove('hidden');
                        chosenCountryGrid.innerHTML = '';
                        chosenCountryGrid.appendChild(selectedCountryElement);
                    });
                });
            }

            // Attach a keyup event listener to the search input
            search.addEventListener('keyup', createSuggestions);


            // function to look through JSON and match names to input text
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

            //event listener on suggestions
            const suggestionText = document.querySelectorAll('.suggestion-text');

            suggestionText.forEach((suggestion, index) => {
                console.log('Adding click listener to suggestion', index);
                suggestion.addEventListener('click', () => {
                    const item = jsonData[index];
                    const selectedCountryElement = createSelectedCountryElement(item);

                    console.log('Suggestion clicked');
                    displaySelectedCountry(selectedCountryElement);
                    chosenCountry.classList.remove('hidden');
                    chosenCountryGrid.innerHTML = '';
                    chosenCountryGrid.appendChild(selectedCountryElement);
                    createBorderButtons(jsonData, index)
                });
            });

            function clearSuggestions() {
                const suggestionContainer = document.querySelector('.suggestion-container');
                while (suggestionContainer.firstChild) {
                    suggestionContainer.removeChild(suggestionContainer.firstChild);
                }
            }

            // HANDLE REGION FILTER WITH DROPDOWN
            const regionDropdown = document.querySelector('#dropdown');

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

            function createBorderButtons(jsonData, index, borderAlpha3Codes) {
                const currentCountry = jsonData[index];
                const buttonContainer = document.querySelector('.border-countries-btn-wrapper');

                // Create buttons for each bordering country
                borderAlpha3Codes.forEach((alpha3Code) => {
                    // Find the country object with the matching alpha3Code
                    const borderCountry = jsonData.find((country) => country.cca3 === alpha3Code); // Use 'cca3' property for matching

                    if (borderCountry) {
                        const button = document.createElement('button');
                        button.classList.add('primary-btn', 'border-btn')
                        button.textContent = borderCountry.name.common;
                        buttonContainer.appendChild(button);
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

// BACK BUTTON TO RETURN TO HOME SCREEN
const back = document.querySelector('#back');
const mainPage = document.querySelector('.home');

back.addEventListener('click', () => {
    chosenCountry.classList.add('hidden');
    mainPage.classList.remove('hidden');


})

const lightModeMoon = document.querySelector('#lightModeMoon');
const darkModeMoon = document.querySelector('#darkModeMoon');
const modeText = document.querySelector('#modeText');


