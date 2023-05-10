const words = require("../words.js");

const loginPage = () => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="/style.css">
        <title>Login Word Guessing Game</title>
      </head>
      <body>
        <div class="login-container">
          <div id="content" class="content-container">
            <form action="/login" method="POST"> 
                <h1>Word Guessing Game</h1>    
              <div class="text-input" id="login_username">
                <input name="username" placeholder="Enter your username" required> 
                <div class="space">
                  <button class="login-button" type="submit">LOGIN</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
    `;
};

const invalidUserNameHtml = (errorMessage) => {
  return `
    <link rel="stylesheet" href="/style.css" />
    <h1>Please Login Again..!!</h1>
    <h2>${errorMessage}</h2>
    
    <form method="GET" action="/">
    <button class="login-button" type="submit">Login</button>
    </form>
  `;
};

const gamePage = (user) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="/style.css">
      <title>Word Guessing Game</title>
    </head>
    <body>
      <div id="word-guessing-game">
        <div>
          <h1> Welcome ${user.username} to Word Guessing Game </h1>
          <div class="logout"> 
            <form action="/logout" method="POST"> 
              <button class="logout-button" type="submit">LOGOUT</button>
            </form>
          </div>
        </div>
        <div class="game-panel">
          <div class="word-list-panel">
          <h2>Acceptable Words List: You can click on the word to guess</h2>
            <div class="word-list">
              ${words.map((word) => `<p class="word">${word}</p>`).join("")}
            </div>
          </div>
          <div class="game-panel-container">
            <p class="turns">
              Number Of Valid Guesses: ${user.game.counyOfValidEnteredGuesses}
              <br><br>
              <span className="score">
              ${
                user.game.enteredGuessWord.length > 0
                  ? ` 
              Your Previous Valid Guess: ${user.game.enteredGuessWord[0].guessedWord} matched ${user.game.enteredGuessWord[0].numberOfSameMatchingLetters} letters with secret word`
                  : ""
              }
              </span>
            </p>
            <div class="control-panel">
              <div class="word-input">
                <form action="/guess" method="POST"> 
                  <input id="guess-field" name="guessedWord" placeholder="Type your guess" required ${
                    user.game.isSuccessfulGame ? "disabled" : "enabled"
                  }> 
                  <button class="guess-button" type="submit" ${
                    user.game.isSuccessfulGame ? "disabled" : "enabled"
                  }>GUESS</button>
                </form>
                <div class="message-panel">
                ${user.game.message}
                </div> 
                <div class="controls">
                  <div class="restart"> 
                    <form action="/restart-game" method="GET"> 
                      <button class="restart-button" type="submit">RESTART</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="accepted-guess-panel">
              <h3>Your valid Guesses & Letter Match History</h3>
              <div class="history-panel">
                  ${user.game.enteredGuessWord
                    .map(
                      (guess) =>
                        `<div><span class="word">You guessed "${guess.guessedWord}"</span> : <span class="word">matched ${guess.numberOfSameMatchingLetters} letters with secret word</span></div>`
                    )
                    .join("")}
              </div>
            </div>
          </div>
        </div> 
      </div>
      <script>
        let words = document.querySelectorAll(".word");
        let guessField = document.querySelector("#guess-field");
        words.forEach(word => {
          word.addEventListener("click", (e) => {
            guessField.value = e.target.innerText;
          });
        });
      </script>
    </body>
  </html>
  `;
};

module.exports = { loginPage, invalidUserNameHtml, gamePage };
