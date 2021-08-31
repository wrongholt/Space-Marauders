/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const battle = require("../helpers/battle");
const initHandler = require("./initiationHandler");
const battleEndHandler = require("./battleEndHandler");
const BattleHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "BattleHandlerIntent"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "battleHandler";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    var moves = helpers.getResolvedWords(handlerInput, "theMove");
    var move;
    var theMonster = "";
    var speakOutput = "";
    if (sessionAttributes.previousIntent === "monsterSelectionHandler") {
      theMonster = sessionAttributes.theMonster;
      speakOutput =
        "Bringing you down to the " +
        theMonster +
        "A sound effect... " +
        "Now to attack please say your attack slot such as, one, two or three";
    }
    if (moves) {
      move = moves[0].value.name;
      if (sessionAttributes.previousIntent === "initiationHandler1") {
        return initHandler.handle(handlerInput);
      } else if (sessionAttributes.previousIntent === "initiationHandler2") {
        return initHandler.handle(handlerInput);
      } else if (sessionAttributes.previousIntent === "initiationHandler3") {
        return initHandler.handle(handlerInput);
      } else {
        if (sessionAttributes.specialSkip) {
          speakOutput = await battle.userBattle(handlerInput, move);
          if (
            sessionAttributes.specialRounds < sessionAttributes.specialSkipTurns
          ) {
            speakOutput += await strings.strings(handlerInput, "skipMonster");
          }
        } else {
          if (
            attributes.profile.stats.health <= 0 ||
            sessionAttributes.monsterStats.stats.health <= 0
          ) {
            return battleEndHandler.handle(handlerInput);
          }
          speakOutput = await battle.userBattle(handlerInput, move);
          speakOutput += await battle.monsterBattle(handlerInput);
        }
      }
    }
    console.log(speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = BattleHandler;
