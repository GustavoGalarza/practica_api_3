document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playBtn');

    playButton.addEventListener('click', () => {
        window.location.href = "game.html"; 
    });

    const imagesCard1 = ['images/img11.jpg', 'images/img12.jpg', 'images/img13.jpg'];
    const imagesCard2 = ['images/img21.png', 'images/img22.png', 'images/img23.png'];
    const imagesCard3 = ['images/img31.jpg', 'images/img32.jpg', 'images/img33.jpg'];

    
    const changeImageRandomly = (cardId, imagesArray) => {
        const card = document.getElementById(cardId);
        const imgElement = card.querySelector('img');
        const randomIndex = Math.floor(Math.random() * imagesArray.length);
        imgElement.src = imagesArray[randomIndex];
    };

    setInterval(() => {
        changeImageRandomly('card1', imagesCard1);
        changeImageRandomly('card2', imagesCard2);
        changeImageRandomly('card3', imagesCard3);
    }, 3000);
});
