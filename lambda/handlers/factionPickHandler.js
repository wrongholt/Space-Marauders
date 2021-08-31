/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const factionsHelper = require("../data/factions");
const factionPickHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "factionPickHandler"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "factionPickHandler";
    var speakOutput = "";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    var theFactions = helpers.getResolvedWords(handlerInput, "theFaction");
    var faction = theFactions[0].value.name;
    console.log(faction);
    var theFactionInfo = await factionsHelper.getFactionInfo(
      faction,
      handlerInput
    );
    console.log("THE FACTION INFO!!!!", theFactionInfo);
    sessionAttributes.faction = theFactionInfo;
    speakOutput = await strings.strings(handlerInput, "factionChoice");
    return handlerInput.responseBuilder
      .speak(helpers.speechPolly(speakOutput, theFactionInfo.helperVoice))
      .reprompt(helpers.speechPolly(speakOutput, theFactionInfo.helperVoice))
      .getResponse();
  },
};
module.exports = factionPickHandler;
