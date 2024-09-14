document.addEventListener('DOMContentLoaded', () => {
    const publicKey = '7a6efc35849d7147226b23231e122ee6';
    const privateKey = '2840c0c7cb130f914f13b3e93e83f7b0aebeccc4';
    const marvelApiUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    const hpApiUrl = 'https://hp-api.herokuapp.com/api/characters';
    const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100';

    const marvelCards = ['marvel-card1', 'marvel-card2', 'marvel-card3'];
    const hpCards = ['hp-card1', 'hp-card2', 'hp-card3'];
    const pokemonCards = ['pokemon-card1', 'pokemon-card2', 'pokemon-card3'];

    const selectedOptions = {
        marvel: null,
        hp: null,
        pokemon: null
    };

    // Función para generar el hash MD5 necesario para la API de Marvel
    const generateMarvelHash = (ts) => {
        const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
        return hash;
    };

    const fetchAndUpdateImages = async (url, cardIds, dataParser) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const items = dataParser(data);
            cardIds.forEach((cardId, index) => {
                const imgElement = document.getElementById(cardId).querySelector('img');
                const nameElement = document.getElementById(cardId).querySelector('.card-name');
                const randomIndex = Math.floor(Math.random() * items.length);
                imgElement.src = items[randomIndex].image;
                imgElement.alt = items[randomIndex].name;
                nameElement.textContent = items[randomIndex].name;
            });
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const updateMarvelCards = async () => {
        const ts = Date.now();
        const hash = generateMarvelHash(ts);
        const url = `${marvelApiUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        fetchAndUpdateImages(url, marvelCards, data => 
            data.data.results.map(character => ({
                name: character.name,
                image: `${character.thumbnail.path}.${character.thumbnail.extension}`
            }))
        );
    };

    const updateHpCards = async () => {
        fetchAndUpdateImages(hpApiUrl, hpCards, data => 
            data.map(character => ({
                name: character.name,
                image: character.image
            }))
        );
    };

    const updatePokemonCards = () => {
        fetchAndUpdateImages(pokemonApiUrl, pokemonCards, data => 
            data.results.map(pokemon => ({
                name: pokemon.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png`
            }))
        );
    };

    document.getElementById('update-marvel').addEventListener('click', updateMarvelCards);
    document.getElementById('update-hp').addEventListener('click', updateHpCards);
    document.getElementById('update-pokemon').addEventListener('click', updatePokemonCards);

    const handleCardClick = (section, cardId) => {
        const selectedCard = document.querySelector(`#${section}-cards .card.selected`);
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
        const card = document.getElementById(cardId);
        card.classList.add('selected');
        selectedOptions[section] = card.querySelector('img').alt;
        
        // se verifica si todas las secciones tienen seleccionas una opcion
        if (selectedOptions.marvel && selectedOptions.hp && selectedOptions.pokemon) {
            showModal();
        }
    };

    const showModal = () => {
        document.getElementById('marriage-result').textContent = `Te casarás con ${selectedOptions.marvel}.`;
        document.getElementById('sleep-result').textContent = `Dormirás con ${selectedOptions.hp}.`;
        document.getElementById('eat-result').textContent = `Te comerás a ${selectedOptions.pokemon}.`;
        document.getElementById('result-modal').style.display = 'block';
    };

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (event) => {
            const cardId = event.currentTarget.id;
            const section = cardId.split('-')[0];
            handleCardClick(section, cardId);
        });
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('result-modal').style.display = 'none';
    });

    // Inicializa las tarjetas con imágenes
    updateMarvelCards();
    updateHpCards();
    updatePokemonCards();
});
