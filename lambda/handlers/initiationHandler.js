/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const battle = require("../helpers/battle");
const inv = require("../data/inventory");
const initiationHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "initiationHandler"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "initiationHandler";
    var speakOutput = "";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    if (!attributes.profile.hasOwnProperty("initiation")) {
      attributes.profile.initiation = true;
      await helpers.saveAttributes(handlerInput, attributes);
    }

    if (!sessionAttributes.hasOwnProperty("init")) {
      sessionAttributes.init = 0;
    }
    var move = "";
    sessionAttributes.init += 1;
    var theMoves = helpers.getResolvedWords(handlerInput, "theMove");
    if (theMoves) {
      move = theMoves[0].value.name;
    }
    switch (sessionAttributes.init) {
      case 1:
        speakOutput = await strings.strings(handlerInput, "welcome");
        sessionAttributes.currentIntent += "1";
        break;
      case 2:
        sessionAttributes.currentIntent += "2";
        speakOutput = await strings.strings(handlerInput, "combatTutorial2");
        break;
      case 3:
        sessionAttributes.currentIntent += "3";
        speakOutput = await strings.strings(handlerInput, "combatTutorial3");
        break;
      case 4:
        speakOutput = await strings.strings(handlerInput, "afterTutorial");
        break;
    }
    if (sessionAttributes.previousIntent === "factionChosenHandler") {
      speakOutput = helpers.speechPolly(
        await strings.strings(handlerInput, "afterFactionPick"),
        attributes.profile.botVoice
      );
      await inv.starterCrate(handlerInput);
    }

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    console.log(speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = initiationHandler;
