/*jshint esversion: 8 */
// const airtable = require("./airtable");
var _ = require("lodash");
require("dotenv").config({
  path: "variable.env",
});
exports.saveAttributes = async (handlerInput, attributes) => {
  var attributesManager = handlerInput.attributesManager;
  attributesManager.setPersistentAttributes(attributes);
  await attributesManager.savePersistentAttributes();
};

exports.getAttributes = async (handlerInput) => {
  var attributesManager = handlerInput.attributesManager;
  var attributes = (await attributesManager.getPersistentAttributes()) || {};

  return attributes;
};

exports.speechPolly = (text, voice) => {
  return "<speak><voice name='" + voice + "'>" + text + "</voice></speak>";
};

exports.supportsAPL = (handlerInput) => {
  if (
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
      "Alexa.Presentation.APL"
    ]
  )
    return true;
  return false;
};

exports.randomNoRepeats = async (array) => {
  var shuffledArray = _.shuffle(array);
  var pickOne = _.sample(shuffledArray);
  return pickOne;
};

exports.getTimeZone = async (handlerInput, deviceId) => {
  const serviceClientFactory = handlerInput.serviceClientFactory;
  let userTimeZone;
  try {
    const upsServiceClient = serviceClientFactory.getUpsServiceClient();
    userTimeZone = await upsServiceClient.getSystemTimeZone(deviceId);
  } catch (error) {
    if (error.name !== "ServiceError") {
      return handlerInput.responseBuilder
        .speak("There was a problem connecting to the service.")
        .getResponse();
    }
    console.log("error", error.message);
  }
  return userTimeZone;
};

exports.getLocale = (handlerInput) => {
  return handlerInput.requestEnvelope.request.locale;
};

exports.getSpokenWords = async (handlerInput, slot) => {
  if (
    handlerInput.requestEnvelope &&
    handlerInput.requestEnvelope.request &&
    handlerInput.requestEnvelope.request.intent &&
    handlerInput.requestEnvelope.request.intent.slots &&
    handlerInput.requestEnvelope.request.intent.slots[slot] &&
    handlerInput.requestEnvelope.request.intent.slots[slot].value
  )
    return handlerInput.requestEnvelope.request.intent.slots[slot].value;
  else return undefined;
};

exports.getResolvedWords = (handlerInput, slot) => {
  if (
    handlerInput.requestEnvelope &&
    handlerInput.requestEnvelope.request &&
    handlerInput.requestEnvelope.request.intent &&
    handlerInput.requestEnvelope.request.intent.slots &&
    handlerInput.requestEnvelope.request.intent.slots[slot] &&
    handlerInput.requestEnvelope.request.intent.slots[slot].resolutions &&
    handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
      .resolutionsPerAuthority
  ) {
    for (
      var i = 0;
      i <
      handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
        .resolutionsPerAuthority.length;
      i++
    ) {
      if (
        handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
          .resolutionsPerAuthority[i] &&
        handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
          .resolutionsPerAuthority[i].values &&
        handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
          .resolutionsPerAuthority[i].values[0]
      )
        return handlerInput.requestEnvelope.request.intent.slots[slot]
          .resolutions.resolutionsPerAuthority[i].values;
    }
  } else return undefined;
};

// exports.updateCredits = async (handlerInput) => {
//   await airtable.getUsersCredits(handlerInput);
//   var attributes = await this.getAttributes(handlerInput);

//   let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
//   var credits = sessionAttributes.Credits;
//   attributes.profile.credits = credits;
//   await this.saveAttributes(handlerInput, attributes);
// };
