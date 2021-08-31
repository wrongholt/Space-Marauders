/*jshint version: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const robbing = require("../helpers/robbing");
const robbingGainMoneyHandler = {
  canHandle(handlerInput) {
    var sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "robbingGainMoneyHandler"
    );
  },
  async handle(handlerInput) {
    var speakOutput = "";
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "robbingGainMoneyHandler";

    await robbing.computeStolenCredits(handlerInput, sessionAttributes.victim);
    speakOutput = await strings.strings(handlerInput, "wordMatch");
    var randomStrings = await strings.strings(handlerInput, "randomStrings");
    speakOutput += " " + (await helpers.randomNoRepeats(randomStrings));
    delete sessionAttributes.inRobHandler;

    console.log("THE SPEAK ---->>>>", speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = robbingGainMoneyHandler;
