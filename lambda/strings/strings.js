const helpers = require("../helpers/helpers");
exports.strings = async (handlerInput, textOutput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var locale = helpers.getLocale(handlerInput);
  var name = "";
  var bot = "";
  var encounters = "";
  if (attributes.hasOwnProperty("profile")) {
    var name = attributes.profile.name;
    var bot = attributes.profile.bot;
    var faction = attributes.profile.faction;
    var world = attributes.profile.world;
    var credits = attributes.profile.credits;
    if (attributes.profile.hasOwnProperty("stats")) {
      var stats = attributes.profile.stats;
      var hack = stats.hack;
      if (attributes.profile.stats.hasOwnProperty("health")) {
        var health = stats.health;
      }
    }
  }
  if (attributes.hasOwnProperty("monsterList")) {
    var monsterList = attributes.monsterList;
  }
  if (sessionAttributes.hasOwnProperty("faction")) {
    var faction = sessionAttributes.faction.name;
    var factionInfo = sessionAttributes.faction.Description;
    var factionBot = sessionAttributes.faction.helper;
  }
  if (sessionAttributes.hasOwnProperty("monsterStats")) {
    var monster = sessionAttributes.monsterStats.name;
    var monsterHealth = sessionAttributes.monsterStats.stats.health;
  }
  if (attributes.hasOwnProperty("worlds")) {
    encounters = attributes.worlds[world].monsterEncounters;
  }
  const theStrings = {
    "en-US": {
      youWin: `Great job you destroyed the ${monster} your payment is on the way. Go back to the ship by saying, ship. `,
      youLost: `Unfortunately we dragged you out of there and revived you. It costed you 100 credits you now have ${credits} left. `,
      itWasATie: `You were killed so we revived you but you also killed the ${monster} so you got a new crate waiting for you. But all you money went to healing you. `,
      skipMonster:
        "The monster was still stunned or cannot see you this round. ",
      userFight: `You hit ${monster} and they now have ${monsterHealth} health left. `,
      monsterFight: `The monster hit you and you now have ${health} health left. `,
      anarkistsDesc:
        "Anarkists are what it sounds like they fight against the system and main competition and nemesis is United Stars. They do hold back and sometimes fight dirty. They are the best melee fighters between the other factions. ",
      unitedStarsDesc:
        "United Stars started from the rubble of Terra but rose to the stars and became a great faction. They have mass amounts of resources and people. They are average in all except the ability to hit with ranged weapons is higher then the others. ",
      animalClanDesc:
        "Animal Clan were first seen on the planet Ultra Major, they are advanced animals that normally would be seen on Terra without the advancements.  They are a free beings that will lash out if provoked but also a very good fighters. They have the best defense and health. ",
      cyberlitesDesc:
        "Cyberlites are mostly machine or cybernetics they have a humanish brain and some other parts here and there. They are great with devices and precision with long range rifles. Most originate from Terra but some on other planets as well.  They excel at tech and are pretty great with a ranged weapon. ",
      thePioneersDesc:
        "Pioneers try to hold to as many of their heritage or cultural ideals.  They are seen weak but it is just a ruse they are very well experienced and have a decent amount of fire power.  They also deal in and use some type of magical devices, not seen in the other factions. They too are great with ranged weapons they also have a slight boost to defense, health and thrown weapons. ",
      noBountyList:
        "Sorry there aren't any bounties on this world at this time. ",
      noMonsterList:
        "I am sorry you will need to encounter a monster to have a monster in this list. ",
      monsterList: `${monsterList}`,
      serviceError: "Uh Oh. Looks like something went wrong. ",
      consent:
        "Please enable Customer Profile permissions in the Amazon Alexa app. After that is completed please come back to Space Marauders ",
      noName:
        "You can set your name either in the Alexa app under calling and messaging, or you can set it at Amazon.com, under log-in and security. ",
      welcome:
        "Excuse me, Hello??? Hey you, yes you the stow away. What are you doing on my ship? You don't know. Let's get you to the sick bay. Ok, so you got a concussion, some rest and you should be fine but we will watch your vitals just in case. Here is your personal device it will tell you what happened and your name. " +
        `Hello, ${name}, I see you got a bump on the head but looks like you are in good hands. I am the default bot and your personal companion to help find those nasty monsters or the competition. I can also handle battling for you if you are not available. I have accessed a memory from 15 hours ago on planet Destigar and I will simulate it in your mind to help you get back on your feet, and get into some action. ` +
        `You have three actions that you can do in a fight, you can say either One, Two or Three for the weapon slots which will activate the weapon or device you have in that slot. You may also say the name of the weapon if you would like.  This monster is getting ready to attack so before they do lets get a ranged attack in which will be slot One, say One. `,
      combatTutorial2: `Great job, ${name} they attacked you right after you but you are still alive! Let's use our melee attack now, they are quick attacks that can do some great damage. Your melee slot is Two, say, Two. `,
      combatTutorial3: `Excellent! The last thing you can do in a battle is your third slot which can be a device or an explosive, in your case it's an explosive. To activate it say, Three. `,
      afterTutorial: `After, you defeated that one beast there was a large explosion that must of where you got the concussion but that was the last thing I recorded. Since you were a recruit and you got this bad concussion I guess you could pick what ever faction you wish to be with. Factions help with drumming up bounties, have perks and battle other factions. Would you like to be with the Anarkists, United Stars, Animal Clan, Cyberlites, or, Pioneers. To get more information on them just say, the name of the faction. If you wish to pick your faction a slight warning you cannot pick this again unless you start over, to pick the faction just say, I choose, then the name of the faction. `,
      factionChoice: `Hello for ${faction}, you get me as your bot and my name is ${factionBot}. ${factionInfo} To pick ${faction}, just say I choose, ${faction}. Otherwise you can say another faction which are Anarkists, United Stars, Cyberlites, Animal Clan or Pioneers `,
      afterFactionPick: `${faction} that sounds like an excellent pick, once again my name is ${bot}.  Now we should go over your inventory, which I see is empty. `,
      emptyInventory: `Hey there is a crate that isn't mine where I found you. You can open it and have the contents. `,
      crateContents: `This crate entails: ${sessionAttributes.crateContents} `,
      welcomeBack:
        "Welcome back, Space Marauder, " +
        name +
        ". As always you can say, Bounty List, Monster List, Faction List, or Leader Boards. ",
      bountyList: `You are at ${world} and the list for bounties is as follows: ${encounters} `,
      leaderboards: ``,
      hackBegin: `The password for this account is ${sessionAttributes.theWordLength} letters long and the passwords theme is ${sessionAttributes.theWordType}. Start by guessing a letter. `,
      noLetterMatch: `${sessionAttributes.theLetter} is not a correct letter keep on trying. The passwords theme is ${sessionAttributes.theWordType}. You have used ${sessionAttributes.theRoundCounter} tries out of ${hack}. `,
      letterMatch: `You have unlocked more of the word it is now ${sessionAttributes.theWordProgress}. Guess another letter or guess the word.  You have used ${sessionAttributes.theRoundCounter} tries out of ${hack}. `,
      noWordMatch: `${sessionAttributes.theGuessedWord}, is wrong keep on guessing. The passwords theme is ${sessionAttributes.theWordType}. You have used ${sessionAttributes.theRoundCounter} tries out of ${hack}. `,
      wordMatch: `${sessionAttributes.theGuessedWord}, is correct well done you have hacked into their account withdrawing money now. You have received ${sessionAttributes.moneyStolenTotal} and your account total is now, ${credits}. `,
      outOfTurns: `You took to long to guess the password, the person you were trying to hack attached a worm to your account, and stole ${sessionAttributes.lostMoneyTotal} credits and your account total is now, ${credits}. `,
      randomStrings: [
        `Would you like to check the Bounty list or jump to another world?`,
        `Would you like to check the Bounty list or jump to another world?`,
        `Would you like to check the Bounty list or jump to another world?`,
        `Would you like to check the Bounty list or jump to another world?`,
      ],
      theUserMissed: "Sorry but you missed. ",
      theMonsterMissed: "The monster missed. ",
    },
  };
  return theStrings[locale][textOutput];
};
