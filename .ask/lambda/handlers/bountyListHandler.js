/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const airtable = require("../helpers/airtable");
const bounties = require("../helpers/bounty");
const bountyListHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "bountyListHandler"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "bountyListHandler";
    var speakOutput = "";
    speakOutput = await bounties.modifyMonsterCounter(handlerInput);

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    console.log(speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = bountyListHandler;
