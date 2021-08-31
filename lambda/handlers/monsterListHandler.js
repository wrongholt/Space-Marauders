/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const factionsHelper = require("../data/dataParser");
const character = require("../helpers/character");
const initialSetup = require("./initiationHandler");
const monsterListHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "monsterListHandler"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "monsterListHandler";
    var speakOutput = "";
    var attributes = await helpers.getAttributes(handlerInput);
    if (!attributes.hasOwnProperty("monsterList")) {
    }
    if (!attributes.hasOwnProperty("monsterList")) {
      attributes.monsterList = [];
      attributes.monsterList.push(sessionAttributes.monsterStats.stats.name);
      await helpers.saveAttributes(handlerInput, attributes);
      speakOutput = await strings.strings(handlerInput, "noMonsterList");
    } else {
      attributes.monsterList.push(sessionAttributes.monsterStats.stats.name);
      await helpers.saveAttributes(handlerInput, attributes);
      speakOutput = await strings.strings(handlerInput, "monsterList");
    }
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    console.log(speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = monsterListHandler;
