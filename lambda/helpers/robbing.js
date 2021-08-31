const helpers = require("./helpers");
const airtable = require("./airtable");
const _ = require("lodash");
exports.stealingOneOhOne = async (handlerInput) => {
  var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var attributes = await helpers.getAttributes(handlerInput);
  if (attributes.hasOwnProperty("profile")) {
    var userID = attributes.profile.userID;
    var name = attributes.profile.name;
  }
  await airtable.updateUserScore(name, userID, handlerInput);
  await airtable.playerWorldRecords(handlerInput);
  await grabOnePlayer(
    handlerInput,
    sessionAttributes.playersWorldRecords.records
  );
};
const grabOnePlayer = async (handlerInput, records) => {
  console.log("THE RECORDs--->>>", records);
  var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var shuffledArrayTypes = _.shuffle(records);
  var record = _.sample(shuffledArrayTypes);
  console.log("THE RECORD--->>>", record);

  sessionAttributes.victim = record;
};
exports.computeStolenCredits = async (handlerInput, record) => {
  var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var attributes = await helpers.getAttributes(handlerInput);
  var monies = record.fields.Credits;
  var percent = Math.floor(Math.random() * 100) / 100;
  var moneyStolen = Math.floor(monies * percent);
  sessionAttributes.moneyStolenTotal = moneyStolen;
  record.fields.Credits = monies - moneyStolen;
  await airtable.updateVictimsCredits(record);
  var yourMoney = attributes.profile.credits;
  var newTotal = yourMoney + moneyStolen;
  await airtable.updateUsersCredits(newTotal, handlerInput);
  attributes.profile.credits = newTotal;
  await helpers.saveAttributes(handlerInput, attributes);
};
exports.computeLoseCredits = async (handlerInput, record) => {
  var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var attributes = await helpers.getAttributes(handlerInput);
  var monies = attributes.profile.credits;
  var percent = Math.floor(Math.random() * 100) / 100;
  var moneyStolen = Math.floor(monies * percent);
  var newTotal = monies - moneyStolen;
  var theirMonies = record.fields.Credits;
  record.fields.Credits = theirMonies + moneyStolen;
  await airtable.updateVictimsCredits(record);
  await airtable.updateUsersCredits(newTotal, handlerInput);
  sessionAttributes.lostMoneyTotal = moneyStolen;
  attributes.profile.credits = newTotal;
  await helpers.saveAttributes(handlerInput, attributes);
};
exports.randomWord = async () => {
  var wordTypes = ["space", "outside", "technology"];
  var words = {
    space: [
      "space",
      "star",
      "moon",
      "sun",
      "comet",
      "astroid",
      "meteoroid",
      "red planet",
      "terra",
      "earth",
      "saturn",
      "venus",
      "mars",
      "pluto",
      "mercury",
      "jupiter",
      "uranus",
      "neptune",
    ],
    outside: [
      "outdoors",
      "rocks",
      "grass",
      "tree",
      "vegetable",
      "fruit",
      "wild life",
      "animal",
    ],
    technology: [
      "password",
      "hack",
      "hacker",
      "worm",
      "spoofing",
      "adware",
      "encryption",
      "malware",
      "phishing",
      "brute force",
      "crack",
      "database",
      "coder",
      "decrypt",
      "processor",
      "memory",
      "graphics",
      "render",
      "audio",
      "speaker",
      "screen",
      "microphone",
      "developer",
    ],
  };
  var shuffledArrayTypes = _.shuffle(wordTypes);
  var pickOneType = _.sample(shuffledArrayTypes);
  var shuffleArrayWords = _.shuffle(words[pickOneType]);
  var pickOneWord = _.sample(shuffleArrayWords);
  console.log(pickOneWord);
  return { type: pickOneType, theWord: pickOneWord };
};

exports.matchingLetter = async (word, letter) => {
  var array = _.split(word, "");
  var index = array.reduce(function (a, e, i) {
    if (e === letter) a.push(i);
    return a;
  }, []);
  if (index) {
    console.log(index);
    return index;
  }
};

exports.theWordProgress = async (
  index,
  theWordLength,
  theBuiltWord,
  theLetter
) => {
  var theNewBuiltWord = [];
  if (theBuiltWord === "") {
    for (var i = 0; i < theWordLength; ) {
      theNewBuiltWord.push("blank");
      i++;
    }
    if (index.length > 1) {
      buildWordIndexLoop(theNewBuiltWord, index, theLetter);
    } else {
      theNewBuiltWord[index] = theLetter;
    }
    return theNewBuiltWord.toString();
  } else {
    var anotherBuiltWord = _.split(theBuiltWord, ",");
    if (index.length > 1) {
      buildWordIndexLoop(anotherBuiltWord, index, theLetter);
    } else {
      anotherBuiltWord[index] = theLetter;
    }
    return anotherBuiltWord.toString();
  }
};

const buildWordIndexLoop = (theBuiltWord, index, theLetter) => {
  var theNewBuiltWord = theBuiltWord;
  for (var i = 0; i < index.length; ) {
    theNewBuiltWord[index[i]] = theLetter;
    i++;
  }
  return theNewBuiltWord;
};
