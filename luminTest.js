// steam api key: D8A942B32A4907C18BBE386D07B6D15F
// testing url: https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key=D8A942B32A4907C18BBE386D07B6D15F&steamid=76561198243655504
// steam id: 76561198243655504
const https = require('node:https');

https.get('https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key=D8A942B32A4907C18BBE386D07B6D15F&steamid=76561198243655504', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});