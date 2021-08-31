/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const factionsHelper = require("../data/factions");
const character = require("../helpers/character");
const initialSetup = require("./initiationHandler");
const factionChosenHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "factionChosenHandler"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "factionChosenHandler";
    var speakOutput = "";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    var theFactions = helpers.getResolvedWords(handlerInput, "theFaction");
    var faction = theFactions[0].value.name;
    var theFactionInfo = await factionsHelper.getFactionInfo(
      faction,
      handlerInput
    );
    console.log(faction);
    await character.createStats(handlerInput, theFactionInfo);

    return initialSetup.handle(handlerInput);
  },
};
module.exports = factionChosenHandler;
