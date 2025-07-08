const cardValues = [
  'eat', 'eat',
  'mocking', 'mocking',
  'love', 'love',
  'angry', 'angry',
  'excited', 'excited',
  'read', 'read',
  'shocked', 'shocked',
  'happy', 'happy'
];

let timerInterval = null;
let timeElapsed = 0;
  let matchCount = 0;
  let testCount = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setupGame() {
  const container = $('#cards-container');
  container.empty(); 
  matchCount = 0;
  testCount = 0;
  $('#moves').text('Score: 0');

  const shuffled = [...cardValues];
  shuffle(shuffled);

  shuffled.forEach(value => {
    const card = $(`
      <div class="card" data-value="${value}">
        <div class="card-inner">
          <div class="card-front">
            <video autoplay muted loop>
              <source src="images/wing.mp4" type="video/mp4">
            </video>
          </div>
          <div class="card-back">
            <img src="images/${value}.png" alt="${value}">
          </div>
        </div>
      </div>
    `);
  
    container.append(card);
    
  });

  attachCardEvents();
}

function attachCardEvents() {
  let flippedCards = [];
  $('.card').on('click', function () {
    const card = $(this);
    const inner = card.find('.card-inner');
    const value = card.data('value');

    if (inner.hasClass('flipped') || flippedCards.length === 2) return;

    inner.addClass('flipped');
    flippedCards.push({ inner, value });

    if (flippedCards.length === 2) {
      const val1 = flippedCards[0].value;
      const val2 = flippedCards[1].value;

      if (val1 === val2) {
        flippedCards = [];
        matchCount++;
        $('#moves').text('Score: ' + matchCount);

        if (matchCount === 8) {
          setTimeout(() => {
            stopTimer();
            alert('Congratulations! You found all matches after ' + testCount + ' attempts and ' + timeElapsed + ' s!');
            setupGame(); // restart automatically
            startTimer();
          }, 500);
        }
      } else {
        setTimeout(() => {
          flippedCards[0].inner.removeClass('flipped');
          flippedCards[1].inner.removeClass('flipped');
          flippedCards = [];
        }, 1000);
        testCount++;
      }
    }
  });
}

function startTimer() {
  timeElapsed = 0;
  $('#timer').text('Time: 0s');
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeElapsed++;
    $('#timer').text(`Time: ${timeElapsed}s`);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}


$(document).ready(function () {
  $('#start-button').on('click', function () {
    $('#front-page').hide();
    $('#game-board').show();
    setupGame();
    startTimer();
  });

  $('#restart-button').on('click', function () {
    setupGame();
    startTimer();
  });

  $('#game-board').hide(); 
});
