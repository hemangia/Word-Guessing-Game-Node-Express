const {
  returnRandomSecretWord,
  checkIfGuessedWordFromList,
  numberOfMatchedAlphabets,
  checkIfEnteredWordIsMatchingSecret,
} = require("./game");

class Game {
  constructor(secretWord) {
    this.secretWord = secretWord;
    this.counyOfValidEnteredGuesses = 0;
    this.enteredGuessWord = [];
    this.isSuccessfulGame = false;
    this.message = "Try to guess the secret word!";
  }

  guessWord(guessedWord) {
    if (this.checkIfWordAlreadyEntered(guessedWord)) {
      this.message = `You have already guessed "${guessedWord}"! Enter a new word from the list!`;
      return;
    }

    if (checkIfGuessedWordFromList(guessedWord)) {
      ++this.counyOfValidEnteredGuesses;
      this.addEnteredGuessWord(guessedWord);
    } else {
      this.message =
        "Invalid word! " +
        guessedWord +
        " is not in the acceptable word list. Try Again!";
      return;
    }

    this.isSuccessfulGame = checkIfEnteredWordIsMatchingSecret(
      this.secretWord,
      guessedWord
    );
    if (this.isSuccessfulGame) {
      this.message = "Congratulations! You won! Hit RESTART to play again!";
    } else {
      this.message = "Try to guess the secret word!";
    }
  }

  addEnteredGuessWord(guessedWord) {
    const numberOfSameMatchingLetters = numberOfMatchedAlphabets(
      this.secretWord,
      guessedWord
    );
    // Add to the beginning of the array
    this.enteredGuessWord.unshift(
      new Guess(guessedWord, numberOfSameMatchingLetters)
    );
  }

  // Check if the word is already guessed
  checkIfWordAlreadyEntered(guessedWord) {
    return this.enteredGuessWord.some((word) => {
      return word.guessedWord === guessedWord;
    });
  }
}

class Guess {
  constructor(guessedWord, numberOfSameMatchingLetters) {
    this.guessedWord = guessedWord;
    this.numberOfSameMatchingLetters = numberOfSameMatchingLetters;
  }
}

class User {
  constructor(username) {
    this.username = username;
    this.game = new Game(returnRandomSecretWord());
    console.log(
      `Secret word for user "${this.username}" is "${this.game.secretWord}"`
    );
  }

  createNewGame() {
    this.game = new Game(returnRandomSecretWord());
    console.log(
      `Secret word for user "${this.username}" is "${this.game.secretWord}"`
    );
  }
}

module.exports = { Game, Guess, User };
