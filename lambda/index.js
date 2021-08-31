// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require("ask-sdk-core");
const {
  DynamoDbPersistenceAdapter,
} = require("ask-sdk-dynamodb-persistence-adapter");
const helpers = require("./helpers/helpers");
const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName: "spaceWestern",
});
const {
  LaunchRequestHandler,
  RobHandler,
  guessLetterForRobHandler,
  guessWordForRobHandler,
  robbingGainMoneyHandler,
  robbingLoseMoneyHandler,
  bountyListHandler,
  monsterListHandler,
  monsterSelectionHandler,
  initiationHandler,
  openBoxHandler,
  BattleHandler,
  battleEndHandler,
  factionPickHandler,
  factionChosenHandler,
} = require("./handlers");
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "You can say hello to me! How can I help?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  },
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
const saveResponseForRepeatingInterceptor = {
  process(handlerInput) {
    console.log("Saving for repeating later…");
    var response;
    if (handlerInput.responseBuilder.getResponse().reprompt) {
      response =
        handlerInput.responseBuilder.getResponse().reprompt.outputSpeech.ssml;
    }
    const sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.lastResponse = response;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    RobHandler,
    guessLetterForRobHandler,
    guessWordForRobHandler,
    robbingGainMoneyHandler,
    robbingLoseMoneyHandler,
    initiationHandler,
    openBoxHandler,
    BattleHandler,
    battleEndHandler,
    bountyListHandler,
    monsterListHandler,
    monsterSelectionHandler,
    factionChosenHandler,
    factionPickHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addResponseInterceptors(saveResponseForRepeatingInterceptor)
  .withPersistenceAdapter(dynamoDbPersistenceAdapter)
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
