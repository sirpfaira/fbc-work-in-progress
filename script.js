var fs = require("fs");

// const countries = require("./app/api/countries/countries.json");
// const competitions = require("./app/api/competitions/competitions.json");
// const teams = require("./app/api/teams/teams.json");

async function myFunction() {
  const uniqueValues = new Set(teams.map((v) => v.uid));

  if (uniqueValues.size < teams.length) {
    console.log("Contains duplicates!");
  } else {
    console.log("No duplicates found!");
  }

  // fs.writeFile("output.json", JSON.stringify(data), function (err) {
  //   if (err) throw err;
  //   console.log("complete");
  // });
}

myFunction();




