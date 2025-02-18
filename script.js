var fs = require("fs");
const finalTeams = require("./final-teams-by-league.json");
const countries = require("./app/api/countries/countries.json");
const competitions = require("./app/api/competitions/competitions.json");

async function myFunction() {
  // fs.writeFile("output.json", JSON.stringify(data), function (err) {
  //   if (err) throw err;
  //   console.log("complete");
  // });
}

// myFunction();

const findDuplicatedIds = (data) => {
  const idCounts = data.reduce((acc, item) => {
    acc[item.uid] = (acc[item.uid] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(idCounts)
    .filter((uid) => idCounts[uid] > 1)
    .map((uid) => parseInt(uid, 10));
};

const duplicatedIds = findDuplicatedIds(finalTeams);

console.log(duplicatedIds); // Output: [1]
