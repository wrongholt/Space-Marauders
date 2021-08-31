/*jshint esversion: 8 */
const Alexa = require("ask-sdk-core");
const helpers = require("../helpers/helpers");
const strings = require("../strings/strings");
const character = require("../helpers/character");
const initiationHandler = require("./initiationHandler");
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  async handle(handlerInput) {
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.previousIntent = sessionAttributes.currentIntent;
    sessionAttributes.currentIntent = "launch";
    var attributes = await helpers.getAttributes(handlerInput);
    var userID = handlerInput.requestEnvelope.context.System.user.userId;
    console.log(JSON.stringify(userID));
    var usersID = userID.slice(userID.length - 6);
    var speakOutput = "";
    if (!attributes.hasOwnProperty("profile")) {
      await character.createProfile(handlerInput);
      if (!attributes.profile.hasOwnProperty("name")) {
        const PERMISSIONS = ["alexa::profile:given_name:read"];
        const { requestEnvelope, serviceClientFactory, responseBuilder } =
          handlerInput;
        const consentToken = requestEnvelope.context.System.apiAccessToken;
        if (!consentToken) {
          speakOutput = await strings.strings(handlerInput, "consent");
          return responseBuilder
            .speak(speakOutput)
            .withAskForPermissionsConsentCard(PERMISSIONS)
            .getResponse();
        } else {
          try {
            const client = serviceClientFactory.getUpsServiceClient();
            const name = await client.getProfileGivenName();
            // const phone = await client.getProfileMobileNumber();
            // const email = await client.getProfileEmail();

            console.log(
              "Name successfully retrieved, now responding to user.",
              client
            );

            if (name == null) {
              speakOutput = await strings.strings(handlerInput, "noName");
            } else {
              // speakOutput =
              //   "Outstanding, " + name + " can't wait to see what you become.";
              attributes.profile.name = name;
              attributes.profile.userID = name + usersID;
              // if (phone) {
              //   attributes.profile.phone = phone;
              // }
              // if (email) {
              //   attributes.profile.email = email;
              // }

              if (!attributes.profile.hasOwnProperty("credits")) {
                attributes.profile.credits = 100;
                await helpers.saveAttributes(handlerInput, attributes);
              }
              if (!attributes.profile.hasOwnProperty("initiation")) {
                return initiationHandler.handle(handlerInput);
              }
            }
          } catch (error) {
            if (error.name !== "ServiceError") {
              speakOutput = await strings.strings(handlerInput, "serviceError");
            }
            console.log("The ERROR", error);
          }
        }
      }
    } else {
      speakOutput = await strings.strings(handlerInput, "welcomeBack");
    }
    await helpers.saveAttributes(handlerInput, attributes);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
module.exports = LaunchRequestHandler;
