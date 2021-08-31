/*jshint esversion: 8 */
var _ = require("lodash");
const helpers = require("./helpers");
const monstersData = require("./monsters");
const airtable = require("./airtable");
const strings = require("../strings/strings");
var moment = require("moment");
exports.createBountyList = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  //   var playerWorld = "Damons";
  var playerWorld = attributes.profile.world;
  var monsterArray = [];
  var randomNumber = getRandomInt(6, 3);

  for (var i = 0; i < randomNumber; i++) {
    var monster = await monstersData.getMonsterStatsByWorld(playerWorld);
    console.log(monster);
    monsterArray.push(monster);
  }
  var newMonsterArray = _.forEach(monsterArray, function (value, key) {
    monsterArray[key] = value + " - " + difficultyRandomizer();
  });
  console.log(newMonsterArray);
  return newMonsterArray;
};

const difficultyRandomizer = () => {
  const difficulty = ["easy", "normal", "hard", "very hard"];
  var shuffledArray = _.shuffle(difficulty);
  var pickOne = _.sample(shuffledArray);
  return pickOne;
};
function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}

exports.modifyMonsterCounter = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  await airtable.monsterWorldRecords(handlerInput);
  var bounty;
  var usersWorld = attributes.profile.world;
  if (!attributes.hasOwnProperty("worlds")) {
    attributes.worlds = {};
  }
  if (!attributes.worlds.hasOwnProperty(usersWorld)) {
    attributes.worlds[usersWorld] = {};
  }
  console.log(
    "THE Record--->>>>",
    sessionAttributes.worldData.records[0].fields
  );
  var airtableTime = sessionAttributes.worldData.records[0].fields.Time;
  var inTenMin = moment(airtableTime).add(10, "minute").format();
  var current = moment().format();
  console.log("IN TEN MIN Variable-->>", inTenMin);
  console.log("Current TIME IS!!!!--->>>", current);
  if (!sessionAttributes.worldData.records[0].fields.Monsters) {
    bounty = await this.createBountyList(handlerInput);
    attributes.worlds[usersWorld].monsterEncounters = bounty;
    await helpers.saveAttributes(handlerInput, attributes);
    airtable.updateWorldMonsters(
      sessionAttributes.worldData.records[0],
      JSON.stringify(bounty)
    );
  } else if (
    inTenMin <= current &&
    sessionAttributes.worldData.records[0].fields.EncounterCounter === 10
  ) {
    console.log("IT HAS BEEN 10 MIN!!!!!!!!!!!");
    bounty = await this.createBountyList(handlerInput);
    attributes.worlds[usersWorld].monsterEncounters = bounty;
    await helpers.saveAttributes(handlerInput, attributes);
    airtable.updateWorldMonsters(
      sessionAttributes.worldData.records[0],
      JSON.stringify(bounty)
    );
  } else if (
    sessionAttributes.worldData.records[0].fields.Monsters ==
      JSON.stringify(attributes.worlds[usersWorld].monsterEncounters) &&
    sessionAttributes.worldData.records[0].fields.EncounterCounter !== 10
  ) {
    console.log("HELLO IN HERE--->>>>!!!");
    bounty = attributes.worlds[usersWorld].monsterEncounters;
    // airtable.updateWorldCounter(sessionAttributes.worldData.records[0]);
  } else if (!attributes.worlds[usersWorld]) {
    bounty = JSON.parse(sessionAttributes.worldData.records[0].fields.Monsters);
  }

  if (bounty) {
    return (speakOutput = await strings.strings(handlerInput, "bountyList"));
  } else {
    return (speakOutput = await strings.strings(handlerInput, "noBountyList"));
  }
};
