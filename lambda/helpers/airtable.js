/*jshint esversion: 8 */
var Airtable = require("airtable");
const fetch = require("node-fetch");
const helpers = require("./helpers");
require("dotenv").config({
  path: "variable.env",
});
var base = new Airtable({ apiKey: process.env.ApiAirtable }).base(
  "appPQ1lZB9SzL4LpJ"
);

exports.updateUserScore = async (user, userId, handlerInput) => {
  console.log(`<=== airtable/updateUserScore.js ===>`);
  const url = `https://api.airtable.com/v0/${process.env.AirtableBase}/Users?api_key=${process.env.ApiAirtable}&filterByFormula=AND(userID%3D%22${userId}%22)`;
  const options = { method: "GET" };

  return fetch(url, options)
    .then((res) => res.json())
    .then(async (r) => {
      if (r.records.length === 0)
        return await createUserRecord(user, userId, handlerInput);
      else {
        return await updateScore(r.records[0], handlerInput);
      }
    });
};

async function createUserRecord(username, userId, handlerInput) {
  var attributes = await helpers.getAttributes(handlerInput);
  var email = "";
  var phone = "";
  if (attributes.profile.email) {
    email = attributes.profile.email;
  }
  if (attributes.profile.phone) {
    phone =
      attributes.profile.phone.countryCode +
      attributes.profile.phone.phoneNumber;
  }
  console.log(`CREATING NEW USER RECORD FOR ${username}`);
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Users").create(
      {
        Name: username,
        userID: userId,
        Phone: phone,
        Email: email,
        Credits: 100,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
}

updateScore = async (user, handlerInput) => {
  console.log("THE USER IS--->>>", user);
  var attributes = await helpers.getAttributes(handlerInput);
  attributes.RecordID = user.id;
  await helpers.saveAttributes(handlerInput, attributes);
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Users").update(
      user.id,
      {
        World: attributes.profile.world,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
};
exports.monsterWorldRecords = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var world = attributes.profile.world;
  console.log(`<=== MonsterDataForWorld ===>`);
  const url = `https://api.airtable.com/v0/${process.env.AirtableBase}/Worlds?api_key=${process.env.ApiAirtable}&filterByFormula=World%3D%22${world}%22`;

  const options = {
    method: "GET",
  };
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => (sessionAttributes.worldData = data));
};
exports.playerWorldRecords = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var world = attributes.profile.world;
  console.log("THE WORLD IS ---->>>> ", world);
  console.log(`<=== PlayerDataForMiniGame ===>`);
  const url = `https://api.airtable.com/v0/${process.env.AirtableBase}/Users?api_key=${process.env.ApiAirtable}&filterByFormula=World%3D%22${world}%22`;

  const options = {
    method: "GET",
  };
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => (sessionAttributes.playersWorldRecords = data));
};

exports.updateVictimsCredits = async (user) => {
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Users").update(
      user.id,
      {
        Credits: user.fields.Credits,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
};
exports.updateWorldCounter = async (world) => {
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Worlds").update(
      world.id,
      {
        EncounterCounter: world.fields.EncounterCounter + 1,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
};
exports.updateWorldMonsters = async (world, monsters) => {
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Worlds").update(
      world.id,
      {
        Monsters: monsters,
        EncounterCounter: 0,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
};
exports.resetWorldCounter = async (world) => {
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Worlds").update(
      world.id,
      {
        EncounterCounter: 0,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
};
exports.updateUsersCredits = async (credits, handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var RecordID = attributes.RecordID;
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  return new Promise((resolve, reject) => {
    airtable("Users").update(
      RecordID,
      {
        Credits: credits,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
};
exports.getUsersCredits = async (handlerInput) => {
  var attributes = await helpers.getAttributes(handlerInput);
  var RecordID = attributes.RecordID;
  var airtable = new Airtable({ apiKey: process.env.ApiAirtable }).base(
    process.env.AirtableBase
  );
  airtable("Users").find(RecordID, function (err, record) {
    if (err) {
      console.error(err);
      return;
    }
    let sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.Credits = record.fields.Credits;
    console.log("Retrieved", record.id);
  });
};
