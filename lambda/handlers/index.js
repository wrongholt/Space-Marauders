/*jshint version: 8 */
const LaunchRequestHandler = require("./launchHandler");
const RobHandler = require("./robHandler");
const guessLetterForRobHandler = require("./guessLetterForRobHandler");
const guessWordForRobHandler = require("./guessWordForRobHandler");
const robbingGainMoneyHandler = require("./robbingGainMoneyHandler");
const robbingLoseMoneyHandler = require("./robbingLoseMoneyHandler");
const initiationHandler = require("./initiationHandler");
const openBoxHandler = require("./openBoxHandler");
const BattleHandler = require("./battleHandler");
const factionPickHandler = require("./factionPickHandler");
const factionChosenHandler = require("./factionChosenHandler");
const bountyListHandler = require("./bountyListHandler");
const monsterListHandler = require("./monsterListHandler");
const monsterSelectionHandler = require("./monsterSelectionHandler");
const battleEndHandler = require("./battleEndHandler");
module.exports = {
  LaunchRequestHandler,
  RobHandler,
  guessLetterForRobHandler,
  guessWordForRobHandler,
  robbingGainMoneyHandler,
  robbingLoseMoneyHandler,
  initiationHandler,
  openBoxHandler,
  BattleHandler,
  bountyListHandler,
  monsterListHandler,
  monsterSelectionHandler,
  factionPickHandler,
  factionChosenHandler,
  battleEndHandler,
};
