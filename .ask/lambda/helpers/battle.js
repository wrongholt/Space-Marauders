const helpers = require("./helpers");
const strings = require("../strings/strings");
const monstersData = require("./monsters");
const inventory = require("../data/inventory");
exports.initBattle = async (handlerInput, monster) => {
  var monster = monstersData.getMonsterStatsByName(monster);
  var attributes = await helpers.getAttributes(handlerInput);
  var userStats = attributes.profile.stats;
  var charLevel = attributes.profile.stats.level;
  console.log("THE MONSTER STATS--->>>", monster);
  if (!attributes.hasOwnProperty("monsterList")) {
    attributes.monsterList = [];
    attributes.monsterList.push(monster.name);
    await helpers.saveAttributes(handlerInput, attributes);
  }

  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.monsterName = monster.name;
  sessionAttributes.userStats = userStats;
  if (charLevel > 1) {
    sessionAttributes.monsterStats = await monstersData.levelMonster(
      handlerInput,
      monster
    );
  } else {
    sessionAttributes.monsterStats = monster;
  }

  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
};

exports.userBattle = async (handlerInput, move) => {
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var userStats = sessionAttributes.userStats;
  var moveStats = whichMove(userStats, move);
  await inventory.modifyStatsByItem(handlerInput, moveStats, move);
  var didTheUserHit = didUserHit(handlerInput, moveStats);
  console.log(
    "Did they hit..." +
      didTheUserHit +
      "...User Move Stats..." +
      JSON.stringify(moveStats)
  );

  if (didTheUserHit) {
    var itemStats = whichMoveItem(handlerInput, move);

    if (itemStats.special) {
      if (!sessionAttributes.special) {
        moveStats = specialAbilities(itemStats);
      } else {
        if (sessionAttributes.specialRounds < itemStats.specialRounds) {
          moveStats = specialAbilities(itemStats);
        } else if (
          sessionAttributes.specialRounds === itemStats.specialRounds
        ) {
          sessionAttributes.special = false;
          handlerInput.attributesManager.setSessionAttributes(
            sessionAttributes
          );
          moveStats = specialAbilities(itemStats);
        }
      }
    }

    var theDamage = attackDamageCalc(moveStats);
    var monsterStat = sessionAttributes.monsterStats.stats;
    var monsterHealth = monsterStat.health;
    monsterStat.health = monsterHealth - theDamage;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    console.log(JSON.stringify(sessionAttributes));
    return await strings.strings(handlerInput, "userFight");
  } else {
    return await strings.strings(handlerInput, "theUserMissed");
  }
};
exports.monsterBattle = async (handlerInput) => {
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var monsterStats = sessionAttributes.monsterStats;
  var chosenMonsterStats = await pickMonsterMove(monsterStats);
  var didTheMonsterHit = await didMonsterHit(handlerInput, chosenMonsterStats);
  console.log(
    "Did they hit..." +
      didTheMonsterHit +
      "...Monster Stats..." +
      JSON.stringify(chosenMonsterStats)
  );
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  var attributes = await helpers.getAttributes(handlerInput);
  if (didTheMonsterHit) {
    var theDamage = attackDamageCalc(chosenMonsterStats);
    var userHealth = attributes.profile.stats.health;
    attributes.profile.stats.health = userHealth - theDamage;
    await helpers.saveAttributes(handlerInput, attributes);
    return await strings.strings(handlerInput, "monsterFight");
  } else {
    return await strings.strings(handlerInput, "theMonsterMissed");
  }
};
const attackDamageCalc = (moveStats) => {
  var min = Math.ceil(moveStats.atkMin);
  var max = Math.floor(moveStats.atkMax);
  return Math.floor(Math.random() * (max - min) + min);
};
const didUserHit = (handlerInput, moveStats) => {
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var monsterStats = sessionAttributes.monsterStats.stats;
  var percent = Math.floor(Math.random() * 100) / 100;
  var userToHitMod = moveStats.toHit;
  var didTheUserHit = userToHitMod - monsterStats.defense;
  if (percent <= didTheUserHit) {
    return true;
  } else {
    return false;
  }
};
const didMonsterHit = async (handlerInput, moveStats) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var userStats = attributes.profile.stats;
  var percent = Math.floor(Math.random() * 100) / 100;
  var monsterToHitMod = moveStats.toHit;
  var didTheUserHit = monsterToHitMod - userStats.defense;
  if (percent <= didTheUserHit) {
    return true;
  } else {
    return false;
  }
};
const whichMove = (userStats, move) => {
  var moveStats = {};
  if (move === "ranged") {
    moveStats.toHit = userStats.rangeToHit;
    moveStats.atkMin = userStats.rangeAtkMin;
    moveStats.atkMax = userStats.rangeAtkMax;
  } else if (move === "melee") {
    moveStats.toHit = userStats.meleeToHit;
    moveStats.atkMin = userStats.meleeAtkMin;
    moveStats.atkMax = userStats.meleeAtkMax;
  } else if (move === "item") {
    moveStats.toHit = userStats.thrownAccuracy;
    moveStats.atkMin = userStats.thrownAtkMin;
    moveStats.atkMax = userStats.thrownAtkMax;
  }
  console.log("Which Move....", moveStats);
  return moveStats;
};
const pickMonsterMove = async (monsterStats) => {
  var move = monsterStats.abilities;
  console.log("Picking Move...", monsterStats);
  move = await helpers.randomNoRepeats(move);
  console.log("THE MOVE--->>>", move);
  return whichMove(monsterStats.stats, move);
};

const specialAbilities = async (itemStats, moveStats, handlerInput) => {
  //TODO: change if statement after specials
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var percent = Math.floor(Math.random() * 100) / 100;
  if (itemStats.specialPercentage) {
    if (sessionAttributes.special) {
      var newMoveStats = await whatSpecial(itemStats, moveStats, handlerInput);
      sessionAttributes.specialRounds = sessionAttributes.specialRounds + 1;
      return newMoveStats;
    } else if (percent <= itemStats.specialPercentage) {
      //special ability activated
      sessionAttributes.special = true;
      sessionAttributes.specialRounds = 1;
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      var newMoveStats = await whatSpecial(itemStats, moveStats, handlerInput);
      return newMoveStats;
    } else {
      return moveStats;
    }
  }
};

const whatSpecial = async (itemStats, moveStats, handlerInput) => {
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  if (itemStats.specialSkip) {
    sessionAttributes.specialSkip = true;
    sessionAttributes.specialSkipTurns = itemStats.specialSkip;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  } else if (itemStats.specialDefense) {
    moveStats.defense += itemStats.specialDefense;
  } else if (itemStats.health) {
    moveStats.health += itemStats.health;
  } else if (itemStats.specialRangedDefense) {
    moveStats.defense += itemStats.specialRangedDefense;
  } else if (itemStats.specialDamage) {
    moveStats.atkMin += itemStats.specialDamage;
    moveStats.atkMax += itemStats.specialDamage;
  } else if (itemStats.specialMeleeToHit) {
    moveStats.toHit = itemStats.specialMeleeToHit;
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
