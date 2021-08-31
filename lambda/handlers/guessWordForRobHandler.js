/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const robHandler = require("./robHandler");
const rob = require("../helpers/robbing");
const robbingGainMoneyHandler = require("./robbingGainMoneyHandler");
const guessWordForRobHandler = {
  canHandle(handlerInput) {
    var sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();

    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "guessWordForRobHandler" &&
      sessionAttributes.inRobHandler === true
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "guessWordForRobHandler";
    var theWords = helpers.getResolvedWords(handlerInput, "theWord");
    var theWord = theWords[0].value.name;
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    sessionAttributes.theGuessedWord = theWord;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    if (sessionAttributes.theWord === theWord) {
      return robbingGainMoneyHandler.handle(handlerInput);
    } else {
      sessionAttributes.theWordMatch = "no match";
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      return robHandler.handle(handlerInput);
    }
  },
};
module.exports = guessWordForRobHandler;
