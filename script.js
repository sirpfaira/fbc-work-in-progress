// var fs = require("fs");
// const countries = require("./app/api/countries/countries.json");
// const competitions = require("./app/api/competitions/competitions.json");
// const teams = require("./app/api/teams/teams.json");
const fixtures = require("./app/api/fixtures/fixtures.json");

const findDuplicatedIds = (data) => {
  const idCounts = data.reduce((acc, item) => {
    acc[item.uid] = (acc[item.uid] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(idCounts)
    .filter((uid) => idCounts[uid] > 1)
    .map((uid) => parseInt(uid, 10));
};

const duplicatedIds = findDuplicatedIds(fixtures);

console.log(duplicatedIds); 