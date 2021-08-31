const factionData = require("../data/factions");
const helpers = require("./helpers");

exports.createProfile = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  if (!attributes.hasOwnProperty("profile")) {
    attributes.profile = {};
    attributes.profile.credits = 100;
    attributes.profile.world = "Thrace";
  }
  await helpers.saveAttributes(handlerInput, attributes);
};

exports.createStats = async (handlerInput, theFactionInfo) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var profile = attributes.profile;
  var level = 0;
  profile.level = level;
  profile.stats = theFactionInfo.levelingTree[level];
  profile.bot = theFactionInfo.helper;
  profile.faction = theFactionInfo.name;
  profile.botVoice = theFactionInfo.helperVoice;
  var level = attributes.profile.level;
  await helpers.saveAttributes(handlerInput, attributes);
};

const updateStats = async (handlerInput, theFactionInfo) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var level = attributes.profile.level;
  attributes.profile.stats = theFactionInfo.levelingTree[level];

  await helpers.saveAttributes(handlerInput, attributes);
};
exports.levelUp = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var theFactionInfo = await factionData.getFactionInfo(
    attributes.profile.faction,
    handlerInput
  );
  var experience = attributes.profile.stats.experience;
  var experienceChange = await experienceForLeveling(handlerInput);
  if (experienceChange) {
    var theLevel = attributes.profile.level;
    attributes.profile.level = theLevel + 1;
    await updateStats(handlerInput, theFactionInfo);
  }
};

const experienceForLeveling = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var experience = attributes.profile.stats.experience;
  var theLevel = attributes.profile.stats.level;
  var levelChange = false;
  switch (experience) {
    case 200:
      theLevel = 2;
      levelChange = true;
      break;
    case 500:
      theLevel = 3;
      levelChange = true;
      break;
    case 900:
      theLevel = 4;
      levelChange = true;
      break;
    case 1400:
      theLevel = 5;
      levelChange = true;
      break;
    case 2000:
      theLevel = 6;
      levelChange = true;
      break;
    case 2700:
      theLevel = 7;
      levelChange = true;
      break;
    case 3500:
      theLevel = 8;
      levelChange = true;
      break;
    case 4400:
      theLevel = 9;
      levelChange = true;
      break;
    case 5400:
      theLevel = 10;
      levelChange = true;
      break;
    case 6600:
      theLevel = 11;
      levelChange = true;
      break;
    case 7800:
      theLevel = 12;
      levelChange = true;
      break;
    case 9100:
      theLevel = 13;
      levelChange = true;
      break;
    case 10500:
      theLevel = 14;
      levelChange = true;
      break;
    case 12000:
      theLevel = 15;
      levelChange = true;
      break;
    case 13600:
      theLevel = 16;
      levelChange = true;
      break;
    case 15300:
      theLevel = 17;
      levelChange = true;
      break;
    case 17100:
      theLevel = 18;
      levelChange = true;
      break;
    case 19000:
      theLevel = 19;
      levelChange = true;
      break;
    case 21000:
      theLevel = 20;
      levelChange = true;
      break;
    default:
      break;
  }
  attributes.profile.stats.level = theLevel;
  await helpers.saveAttributes(handlerInput, attributes);
  return levelChange;
};
