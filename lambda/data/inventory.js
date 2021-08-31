/*jshint esversion: 8 */
const fs = require("fs");
var _ = require("lodash");
const helpers = require("../helpers/helpers");
// Get document, or throw exception on error
let doc = {};
try {
  doc = JSON.parse(fs.readFileSync(__dirname + "/inventory.json", "utf8"));
} catch (e) {
  console.log(e);
}
exports.readInventory = () => {
  return doc;
};
exports.getFactionSlotSpecificLoot = async (
  equipmentSlot,
  faction,
  handlerInput
) => {
  //TODO change 0 to crate type
  var attributes = await helpers.getAttributes(handlerInput);
  var level = getRarity(0);
  var lootSection = doc[equipmentSlot][faction][level];
  var loot = await helpers.randomNoRepeats(lootSection);
  const usersLevel = attributes.profile.stats.level;
  var leveledLoot = await levelUpLoot(loot, usersLevel);
  return leveledLoot;
};
exports.getFactionSpecificLoot = async (faction, handlerInput) => {
  var equipmentSlot = await helpers.randomNoRepeats([
    "slotOne",
    "slotTwo",
    "slotThree",
  ]);
  var attributes = await helpers.getAttributes(handlerInput);
  var level = getRarity(0);
  var lootSection = doc[equipmentSlot][faction][level];
  var loot = await helpers.randomNoRepeats(lootSection);
  const usersLevel = attributes.profile.stats.level;
  var leveledLoot = await levelUpLoot(loot, usersLevel);
  return leveledLoot;
};
exports.getNonFactionSpecificLoot = async () => {
  var equipmentSlot = await helpers.randomNoRepeats([
    "slotOne",
    "slotTwo",
    "slotThree",
  ]);
  //TODO Fix rarity
  var level = getRarity(0);
  var faction = await helpers.randomNoRepeats([
    "Anarkists",
    "United Stars",
    "Animal Clan",
    "Cyberlites",
    "Pioneers",
  ]);
  var lootSection = doc[equipmentSlot][faction][level];
  console.log("THE LOOTSECTION-->>", lootSection);
  var attributes = await helpers.getAttributes(handlerInput);
  var loot = await helpers.randomNoRepeats(lootSection);
  console.log("THE LOOT-->>", loot);
  const usersLevel = attributes.profile.stats.level;
  var leveledLoot = await levelUpLoot(loot, usersLevel);
  return leveledLoot;
};
// exports.getAllTheStuff = async () => {
//   var equipmentSlot = ["slotOne", "slotTwo", "slotThree"];
//   var level = ["common", "uncommon", "rare"];
//   var faction = [
//     "Anarkists",
//     "United Stars",
//     "Animal Clan",
//     "Cyberlites",
//     "Pioneers",
//   ];
//   var arrayOfInv = [];
//   // for (const slot in doc) {
//   //   for (const faction in doc[slot]) {
//   //     for (const level in doc[slot][faction]) {
//   //       arrayOfInv.push(doc[slot][faction][level]);
//   //     }
//   //   }
//   // }
//   for (let i = 0; i < doc.length; ) {
//     arrayOfInv.push(doc[i].name);
//     i++;
//   }
//   console.dir(JSON.stringify(arrayOfInv), { maxArrayLength: null });
//   // console.log("THE array-->>", _.uniq(arrayOfInv));
// };
const levelUpLoot = async (loot, usersLevel) => {
  var percentage = generateRandomNumber(usersLevel);
  console.log("THE PERCENT--->>>", percentage);
  _.forEach(loot, function (value, k) {
    if (isInt(loot[k])) {
      loot[k] = Math.round(loot[k] * (1 + percentage));
    } else if (isFloat(loot[k])) {
      loot[k] = Math.round(loot[k] * (1 + percentage) * 100) / 100;
    }
  });
  return loot;
};
function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function generateRandomNumber(level) {
  var min = 0.01,
    max = 0.15,
    highlightedNumber = Math.random() * (max - min) + min;
  return highlightedNumber * level;
}
const getRarity = (crate) => {
  var rareLow = 0.01;
  var rareHigh = 0.1 + crate;
  var uncommonHigh = 0.35 + crate;
  var percent = Math.floor(Math.random() * 100) / 100;
  if (percent > rareLow && percent <= rareHigh) {
    rarity = "rare";
  } else if (percent > rareHigh && percent <= uncommonHigh) {
    rarity = "uncommon";
  } else {
    rarity = "common";
  }
  return rarity;
};
exports.starterCrate = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var loot1 = await this.getFactionSlotSpecificLoot(
    "slotOne",
    attributes.profile.faction,
    handlerInput
  );
  await pushToEquipped(loot1, "slotOne", handlerInput);
  var loot2 = await this.getFactionSlotSpecificLoot(
    "slotTwo",
    attributes.profile.faction,
    handlerInput
  );
  await pushToEquipped(loot2, "slotTwo", handlerInput);
  var loot3 = await this.getFactionSlotSpecificLoot(
    "slotThree",
    attributes.profile.faction,
    handlerInput
  );
  await pushToEquipped(loot3, "slotThree", handlerInput);
};

async function pushToEquipped(equipment, slot, handlerInput) {
  var attributes = await helpers.getAttributes(handlerInput);
  console.log("EQUIPPING!!!");
  if (!attributes.profile.hasOwnProperty("equipment")) {
    attributes.profile.equipment = {};
    attributes.profile.equipment.inventory = [];
    attributes.profile.equipment.equipped = {};
  }
  attributes.profile.equipment.equipped[slot] = equipment;
  await helpers.saveAttributes(handlerInput, attributes);
}

exports.modifyStatsByItem = async (handlerInput, moveStats, move) => {
  var itemStats = await whichMoveItem(handlerInput, move);
  if (itemStats.additionalDamage) {
    moveStats.atkMin += itemStats.additionalDamage;
    moveStats.atkMax += itemStats.additionalDamage;
  }
  return moveStats;
};

const whichMoveItem = async (handlerInput, move) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var itemStats = {};
  if (move === "ranged") {
    itemStats = attributes.profile.equipment.equipped.slotOne;
  } else if (move === "melee") {
    itemStats = attributes.profile.equipment.equipped.slotTwo;
  } else if (move === "item") {
    itemStats = attributes.profile.equipment.equipped.slotThree;
  }
  return itemStats;
};
