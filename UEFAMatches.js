'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

async function getTeams(year, k) {
    const baseUrl = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEA%20Champions%20League&year=${year}&page=`;
    const teamsMatchesCount = {};

    let pageNumber = 1;
    let totalPages = 1;


    
    for (let pageNumber = 1 ; pageNumber <= totalPages ; pageNumber++){
        const url = baseUrl + pageNumber;
        
        const data = await fetchData(url);
        
        data.data.forEach(match => {
            if (match.team1){
                teamsMatchesCount[match.team1] = (teamsMatchesCount[match.team1] || 0) + 1;
            }
            if(match.team2){
                 teamsMatchesCount[match.team1] = (teamsMatchesCount[match.team1] || 0) + 1;
            }
        });
    }

    // Filter teams that have played at least k matches
    const result = Object.keys(teamsMatchesCount).filter(team => teamsMatchesCount[team] >= k);
    // Sort the results in ascending order
    return result.sort();
}

// Function to perform an HTTPS GET request
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            // A chunk of data has been received
            response.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received
            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}

async function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const year = parseInt(readLine().trim());
  const k = parseInt(readLine().trim());

  const teams = await getTeams(year, k);

  for (const team of teams) {
    ws.write(`${team}\n`);
  }
}
