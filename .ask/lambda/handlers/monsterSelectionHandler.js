/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
var _ = require("lodash");
const strings = require("../strings/strings");
const battle = require("../helpers/battle");
const battleHandler = require("./battleHandler");
const monsterSelectionHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "monsterSelectionHandler"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "monsterSelectionHandler";
    var speakOutput = "";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    var theMonsters = helpers.getResolvedWords(handlerInput, "monsters");
    var theDifficulty = helpers.getResolvedWords(handlerInput, "difficulty");
    var theMonster = theMonsters[0].value.name;
    var difficulty = theDifficulty[0].value.name;
    var theComboString = theMonster + " - " + difficulty;
    var world = attributes.profile.world;
    if (
      _.includes(attributes.worlds[world].monsterEncounters, theComboString)
    ) {
      sessionAttributes.monsterDifficulty = difficulty;
      battle.initBattle(handlerInput, theMonster);
      sessionAttributes.theMonster = theMonster;
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      return battleHandler.handle(handlerInput);
    } else {
      speakOutput = "Sorry No Match";
    }

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    console.log(speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = monsterSelectionHandler;
