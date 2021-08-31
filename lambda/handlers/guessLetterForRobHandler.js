/*jshint version: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const robHandler = require("./robHandler");
const rob = require("../helpers/robbing");
const guessLetterForRobHandler = {
  canHandle(handlerInput) {
    var sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();

    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "guessLetterForRobHandler" &&
      sessionAttributes.inRobHandler === true
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "guessLetterForRobHandler";
    var theLetters = helpers.getResolvedWords(handlerInput, "theLetter");
    var theLetter = theLetters[0].value.name;
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    sessionAttributes.theLetter = theLetter;
    var match = await rob.matchingLetter(sessionAttributes.theWord, theLetter);
    console.log("THE MATCH LETTER", match);
    sessionAttributes.theLetterMatch = match;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    return robHandler.handle(handlerInput);
  },
};
module.exports = guessLetterForRobHandler;
