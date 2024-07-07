// Les énigmes classées par difficulté
const enigmes = {
    easy: [
        { question: "Animal domestique qui aime les souris", answer: "chat" },
        { question: "Lieu où l'on nage", answer: "piscine" },
        { question: "Appareil utilisé pour appeler", answer: "téléphone" }
    ],
    medium: [
        { question: "Objet pour écrire", answer: "stylo" },
        { question: "Repas du matin", answer: "petit déjeuner" },
        { question: "Véhicule à deux roues", answer: "vélo" }
    ],
    hard: [
        { question: "Endroit où l'on dort", answer: "lit" },
        { question: "Appareil pour prendre des photos", answer: "caméra" },
        { question: "Fruit jaune et courbé", answer: "banane" }
    ]
};

// Initialisation des variables de jeu
let score = 0;
let attempts = 6;
let enigmeActuelle = {};
let motsTrouves = 0;
let timer;
let timeLeft = 15;
let difficulty = 'easy';

// Récupère les énigmes selon la difficulté choisie
function getEnigmes() {
    return enigmes[difficulty];
}

// Change la difficulté et redémarre le jeu
function changeDifficulty() {
    difficulty = document.getElementById('difficultySelect').value;
    restartGame();
}

// Génère une version partiellement masquée du mot
function maskWord(word) {
    let maskedWord = '';
    for (let i = 0; i < word.length; i++) {
        maskedWord += (Math.random() < 0.5) ? word[i] : '_';
    }
    return maskedWord;
}

// Sélectionne une nouvelle énigme et réinitialise le timer
function nouvelleEnigme() {
    const enigmesList = getEnigmes();
    const index = Math.floor(Math.random() * enigmesList.length);
    enigmeActuelle = enigmesList[index];
    document.querySelector('.enigme').innerText = enigmeActuelle.question;
    document.querySelector('.masque').innerText = maskWord(enigmeActuelle.answer);
    document.getElementById('wordInput').value = '';
    resetTimer();
}

// Réinitialise le timer à 15 secondes et démarre le compte à rebours
function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    document.getElementById('timeLeft').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').innerText = timeLeft;
        if (timeLeft <= 0) {
            checkWord(true);
        }
    }, 1000);
}

// Joue le son correspondant à la bonne ou mauvaise réponse
function playSound(correct) {
    const sound = document.getElementById(correct ? 'correctSound' : 'wrongSound');
    sound.play();
}

// Affiche une animation pour indiquer si la réponse est correcte ou incorrecte
function showAnimation(correct) {
    const animationElement = document.getElementById('animation');
    animationElement.innerText = correct ? "Correct!" : "Incorrect!";
    animationElement.style.color = correct ? "green" : "red";
    animationElement.classList.add('show');
    setTimeout(() => {
        animationElement.classList.remove('show');
    }, 1000);
}

// Vérifie la réponse de l'utilisateur
function checkWord(timeout = false) {
    const userWord = document.getElementById('wordInput').value.trim().toLowerCase();
    const inputArea = document.querySelector('.input-area');
    if (timeout || userWord !== enigmeActuelle.answer) {
        playSound(false);
        showAnimation(false);
        inputArea.classList.add('incorrect');
        setTimeout(() => {
            inputArea.classList.remove('incorrect');
        }, 1000);
    } else {
        score++;
        motsTrouves++;
        playSound(true);
        showAnimation(true);
        inputArea.classList.add('correct');
        setTimeout(() => {
            inputArea.classList.remove('correct');
        }, 1000);
    }
    attempts--;
    updateScore();
    if (attempts > 0) {
        nouvelleEnigme();
    } else {
        displayFinalMessage();
    }
}

// Met à jour le score affiché
function updateScore() {
    document.querySelector('.score').innerText = `Score: ${score}`;
}

// Affiche le message final en fonction du nombre de mots trouvés
function displayFinalMessage() {
    clearInterval(timer);
    const messageElement = document.querySelector('.message');
    if (motsTrouves >= 3) {
        messageElement.innerText = "Vous avez gagné!";
        messageElement.style.color = 'green';
        updateLeaderboard();
    } else {
        messageElement.innerText = "Vous avez perdu!";
        messageElement.style.color = 'red';
    }
    document.querySelector('.input-area').style.display = 'none';
    document.querySelector('.restart-btn').style.display = 'block';
    messageElement.classList.add('show');
}

// Met à jour le tableau de classement en stockant les scores dans le localStorage
function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ score, difficulty });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Score: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Redémarre le jeu en réinitialisant les variables et en choisissant une nouvelle énigme
function restartGame() {
    score = 0;
    attempts = 6;
    motsTrouves = 0;
    document.querySelector('.score').innerText = `Score: ${score}`;
    document.querySelector('.message').innerText = '';
    document.querySelector('.input-area').style.display = 'block';
    document.querySelector('.restart-btn').style.display = 'none';
    nouvelleEnigme();
}

// Lance une nouvelle énigme et met à jour le tableau de classement au chargement de la page
window.onload = () => {
    localStorage.removeItem('leaderboard'); // Réinitialiser le leaderboard à chaque rafraîchissement
    nouvelleEnigme();
    updateLeaderboard();
};

// Démarre le timer lorsque l'utilisateur commence à écrire
document.getElementById('wordInput').addEventListener('input', () => {
    if (timeLeft === 15) {
        resetTimer();
    }
});
