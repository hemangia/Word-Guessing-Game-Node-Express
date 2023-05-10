const { checkUsername } = require("./validation/validation");
const { Game, Guess, User } = require("./routes/models");
const { loginPage, gamePage } = require("./views/html-view");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(cookieParser());

const sessions = {};
const userSidObjMap = {};

const returnSidIfUserExist = (username) => {
  if (username in userSidObjMap) {
    return userSidObjMap[username];
  }

  return null;
};

const addNewuserSidObjMapping = (username, sid) => {
  userSidObjMap[username] = sid;
};

const addNewUser = (sid, username) => {
  sessions[sid] = new User(username);
};

const returnUser = (sid) => {
  return sessions[sid];
};

app.get("/", (req, res) => {
  const sid = req.cookies.sid;
  let pageHtmlToBeRendered;
  if (sid && sid in sessions) {
    const user = returnUser(sid);
    pageHtmlToBeRendered = gamePage(user);
  } else {
    pageHtmlToBeRendered = loginPage();
  }

  res.send(pageHtmlToBeRendered);
});

app.post("/login", checkUsername, (req, res) => {
  const { username } = req.body;
  let sid = returnSidIfUserExist(username);
  if (!sid) {
    sid = uuidv4();
    addNewUser(sid, username);
    addNewuserSidObjMapping(username, sid);
  }
  res.cookie("sid", sid, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  res.redirect("/");
});

app.post("/guess", (req, res) => {
  let { guessedWord } = req.body;
  guessedWord = guessedWord.trim();
  const sid = req.cookies.sid;
  const user = returnUser(sid);
  if (user === undefined) {
    let html = "<h1>Invalid User!! Please login Again</h1>" + loginPage();
    res.send(html);
  } else {
    user.game.guessWord(guessedWord);
    res.redirect("/");
  }
});

app.get("/restart-game", (req, res) => {
  const sid = req.cookies.sid;
  const user = returnUser(sid);
  user.createNewGame();
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("sid");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
