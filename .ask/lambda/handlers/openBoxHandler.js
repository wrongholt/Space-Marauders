/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const inv = require("../data/inventory");
const openBoxHandler = {
  canHandle(handlerInput) {
    var sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "openBoxHandler"
    );
  },
  async handle(handlerInput) {
    var speakOutput = "";
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "openBoxHandler";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    if (sessionAttributes.previousIntent === "launch") {
      await inv.starterCrate(handlerInput);
    }
    if (sessionAttributes.factionChest === true) {
      var loot = await inv.getFactionSpecificLoot(attributes.profile.faction);
    } else {
      var loot = await inv.getNonFactionSpecificLoot();
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = openBoxHandler;
