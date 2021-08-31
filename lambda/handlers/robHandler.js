/*jshint version: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const rob = require("../helpers/robbing");
const robbingLoseMoneyHandler = require("./robbingLoseMoneyHandler");
const RobHandler = {
  canHandle(handlerInput) {
    var sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "RobHandlerIntent"
    );
  },
  async handle(handlerInput) {
    var speakOutput = "";
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "RobHandlerIntent";
    var attributes = await helpers.getAttributes(handlerInput);
    var locale = helpers.getLocale(handlerInput);
    if (!sessionAttributes.hasOwnProperty("theWord")) {
      await rob.stealingOneOhOne(handlerInput);
      var theWordObj = await rob.randomWord();
      var theWord = theWordObj.theWord;
      var theWordType = theWordObj.type;
      var theWordLength = theWord.length;
      sessionAttributes.theWord = theWord;
      sessionAttributes.theWordType = theWordType;
      sessionAttributes.theWordLength = theWordLength;
      sessionAttributes.theRoundCounter = 0;
      sessionAttributes.inRobHandler = true;
      console.log(
        "THE OTHER PLAYER-->>> ",
        JSON.stringify(sessionAttributes.playersWorldRecords)
      );
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      speakOutput = await strings.strings(handlerInput, "hackBegin");
    } else if (
      sessionAttributes.previousIntent === "guessLetterForRobHandler"
    ) {
      var theLetterMatch = sessionAttributes.theLetterMatch;
      var theCounter = sessionAttributes.theRoundCounter;
      var newCounter = theCounter + 1;
      sessionAttributes.theRoundCounter = newCounter;
      var hackCounter = attributes.profile.stats.hack;

      if (newCounter === hackCounter) {
        return robbingLoseMoneyHandler.handle(handlerInput);
      }
      if (theLetterMatch.length === 0) {
        speakOutput = await strings.strings(handlerInput, "noLetterMatch");
      } else {
        var theBuiltWord = "";
        if (sessionAttributes.hasOwnProperty("theWordProgress")) {
          theBuiltWord = sessionAttributes.theWordProgress;
        }
        var theNewBuiltWord = await rob.theWordProgress(
          theLetterMatch,
          sessionAttributes.theWordLength,
          theBuiltWord,
          sessionAttributes.theLetter
        );
        sessionAttributes.theWordProgress = theNewBuiltWord;
        speakOutput = await strings.strings(handlerInput, "letterMatch");
      }
    } else if (sessionAttributes.previousIntent === "guessWordForRobHandler") {
      var theLetterMatch = sessionAttributes.theLetterMatch;
      var theCounter = sessionAttributes.theRoundCounter;
      var newCounter = theCounter + 1;
      sessionAttributes.theRoundCounter = newCounter;
      var hackCounter = attributes.profile.stats.hack;
      if (newCounter === hackCounter) {
        return robbingLoseMoneyHandler.handle(handlerInput);
      }
      if (theWordMatch === "no match") {
        speakOutput = await strings.strings(handlerInput, "noWordMatch");
      }
    }

    console.log("SPEAK THIS--->>>", speakOutput);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = RobHandler;
