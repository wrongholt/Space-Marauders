/*jshint esversion: 8 */
const fs = require("fs");
var _ = require("lodash");
// const helpers = require("./helpers");
let doc2 = {};
try {
  doc2 = JSON.parse(fs.readFileSync(__dirname + "/monsters.json", "utf8"));
} catch (e) {
  console.log(e);
}
exports.getNames = () => {
  var arrayOfInv = [];
  for (let i = 0; i < doc2.monsters.length; ) {
    arrayOfInv.push(doc2.monsters[i].name);
    i++;
  }
  console.log(arrayOfInv);
};
exports.getMonsterStatsByName = (monster) => {
  var monsters = doc2.monsters;
  var monsterStats;
  for (let i = 0; i < monsters.length; ) {
    if (monsters[i].name === monster) {
      monsterStats = doc2.monsters[i];
    }
    i++;
  }
  return monsterStats;
};
exports.getMonsterStatsByRandom = () => {
  var monsters = doc2.monsters;
  var shuffledArray = _.shuffle(monsters);
  var monsterStats = _.sample(shuffledArray);
  return monsterStats;
};
exports.getMonsterStatsByWorld = async (world) => {
  var monsters = doc2.monsters;
  console.log("THE MONSTERS TOTAL IS----->>>>>!!!!", monsters.length);
  var filteredArray = _.filter(monsters, function (o) {
    return _.includes(o.stats.world, world);
  });
  var aMonster = _.sample(filteredArray);
  var monsterName = aMonster.name;
  return monsterName;
};
exports.levelMonster = async (handlerInput, monster) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var charLevel = attributes.profile.stats.level;
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var monsterStats = getMonsterStatsByName(monster);
  var difficulty = sessionAttributes.monsterDifficulty;

  var monsterStatsNew = levelingMonster(
    monsterStats.stats,
    charLevel,
    difficulty
  );

  return monsterStatsNew;
};
const levelingMonster = (monsterStats, charLevel, difficulty) => {
  if (difficulty === "easy") {
    if (charLevel === 1) {
      charLevel = 1;
    } else charLevel -= 1;
  } else if (difficulty === "normal") {
    charLevel = charLevel;
  } else if (difficulty === "hard") {
    charLevel += 1;
  } else if (difficulty === "extra hard") {
    charLevel += 2;
  }

  if (charLevel > 1) {
    var percentage = generateRandomNumber(charLevel);
    _.forEach(monsterStats, function (value, key) {
      if (isInt(monsterStats[key])) {
        monsterStats[key] = Math.round(monsterStats[key] * (1 + percentage));
      } else if (isFloat(monsterStats[key])) {
        monsterStats[key] =
          Math.round(monsterStats[key] * (1 + percentage) * 100) / 100;
      }
    });
  }
  console.log(monsterStats);
  return monsterStats;
};
function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function generateRandomNumber(level) {
  var min = 0.05,
    max = 0.15,
    highlightedNumber = Math.random() * (max - min) + min;
  return highlightedNumber * level;
}
