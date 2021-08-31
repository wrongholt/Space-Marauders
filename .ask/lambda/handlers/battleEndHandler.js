/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const battle = require("../helpers/battle");
const initHandler = require("./initiationHandler");
const battleEndHandler = {
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
    var speakOutput = "";
    if (
      attributes.profile.stats.health <= 0 &&
      sessionAttributes.monsterStats.stats.health <= 0
    ) {
      speakOutput = await strings.strings(handlerInput, "itWasATie");
    } else if (attributes.profile.stats.health <= 0) {
      speakOutput = await strings.strings(handlerInput, "youLost");
    } else if (sessionAttributes.monsterStats.stats.health <= 0) {
      speakOutput = await strings.strings(handlerInput, "youWin");
    }

    console.log(speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = battleEndHandler;
