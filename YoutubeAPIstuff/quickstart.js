const {google} = require('googleapis');
const path = require('path');
var playlist = [];
var token = "";
// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: 'athorizationID'
});
// finds the playlists and how long it is, this will only run once it is known that the url is a playlist
async function runPlaylist(searchterm) {

  const res = await youtube.playlists.list({
    part: 'contentDetails',
    id: searchterm,
    maxResults: 1,
  });
  if (res.data.pageInfo.totalResults === 0){
    return false;
  } else {
    // checks for the length of playlist and decides on the amount of times the nextpagetoken will be needed
    if (res.data.pageInfo.totalResults > 50){
      if ((res.data.pageInfo.totalResults % 50) > 0){
        var loopCount = (res.data.pageInfo.totalResults / 50) + 1;
        if (loopCount > 5){
          loopCount = 5;
        }
      } else {
        var loopCount = res.data.pageInfo.totalResults / 50;
        if (loopCount > 5){
          loopCount = 5;
        }
      }
      for (let i = 0; i < loopCount; i++){
        token = await playlistDev(searchterm, token);
      }
    } else {
      token = await playlistDev(searchterm, token);
    }
    const actualPlaylist = new playlistThing(playlist, true);
    playlist = [];
    return actualPlaylist;
  }
  
}
// this handles checking for specific edge cases of submitted youtube playlist urls
async function runSample(searchterm) {
  if (searchterm.includes('&list=LM')){ searchterm = searchterm.substring(0, searchterm.indexOf('&list=LM')); } //plays the song from the likes playlist even though it isnt available
  if (searchterm.includes('&list=')){                                            // checks to see if this is a playlist link
    if (!searchterm.includes('music.youtube.com')){                              // checks to see if the link is from music.youtube.com, because the link could be different youtube.com
        if (!searchterm.includes('&index')){                                     // checks to see if this is a song in the playlist
          var playlistID = searchterm.substr(searchterm.indexOf('&list=') + 6); // gets the playlist link
          return await runPlaylist(playlistID);
        } else {
          searchterm = searchterm.substr(0, searchterm.indexOf('&list=')); // gets the song link
          return videoSearch(searchterm);
        }
      } else if (searchterm.includes('?list=')){
    var playlistID = searchterm.substr(searchterm.indexOf('?list=') + 6); // gets the playlist link
    return await runPlaylist(playlistID);
    } else {
      searchterm = searchterm.substr(0, searchterm.indexOf('&list='));
      return videoSearch(searchterm);
    }
  } else {
    if (searchterm.includes('&t=')){ searchterm = searchterm.substring(0, searchterm.indexOf('&t=')); }
    return videoSearch(searchterm);
  }
}
// retrieves the needed video data
async function videoInfo(searchterm) {

  const res = await youtube.videos.list({
    part: ['snippet, id, contentDetails, statistics'],
    id: searchterm,
  });

  return res;
}
// searches for the specific video with the youtube api
async function videoSearch(searchterm) {
  const res = await youtube.search.list({
      part: 'id',
      type: 'video',
      safeSearch: 'strict',
      maxResults: 1,
      q: searchterm,
    });
  console.log(res.data.items);
  if (res.data.pageInfo.totalResults === 0){
    return false;
  } else {
    const actualPlaylist = new playlistThing(await videoInfo(res.data.items[0].id.videoId), false);
    return actualPlaylist;
  }
  return res;
}
// creates the complete playlist, each array variable contains video data
async function playlistDev(searchterm, token){
  const res = await youtube.playlistItems.list({
      part: 'contentDetails',
      nextPageToken: token,
      playlistId: searchterm,
      maxResults: 50,
    });
  let i = 0;
    while (i < res.data.pageInfo.totalResults && i < 50){
      var ses = await videoInfo(res.data.items[i].contentDetails.videoId);
      current = new currentVideo(
        ses.data.items[0].snippet.title, 
        `https://www.youtube.com/watch?v=${ses.data.items[0].id}`, 
        ses.data.items[0].snippet.channelTitle, 
        `https://www.youtube.com/c/${ses.data.items[0].snippet.channelId}`, 
        ses.data.items[0].snippet.thumbnails.high.url, 
        ses.data.items[0].statistics.likeCount, 
        ses.data.items[0].statistics.viewCount, 
        ses.data.items[0].contentDetails.duration, 
        ses.data.items[0].snippet.publishedAt, 
        1
        );
      playlist.push(current);
      i++;
    }
    return res.nextPageToken; // the youtube api can only output 50 videos max on one call, and the next page token is needed if you have a longer than 50 videos playlist and need the rest
}

module.exports = {
  runSample
}
// simple object for holding a variable and playlist identifier
class playlistThing{
  constructor(PLAYLIST, IFPLAYLIST){
    this.PLAYLIST = PLAYLIST;
    this.IFPLAYLIST = IFPLAYLIST
  }
}
// similar to the class that is present in the musiccommands.js file, object for handling video data
class currentVideo{
  constructor(TITLE, VIDEOID, AUTHOR, AUTHORID, IMAGEURL, LIKES, VIEWS, LENGTH, UPLOADDATE, FILLED){
    this.TITLE = TITLE;
    this.VIDEOID = VIDEOID;
    this.AUTHOR = AUTHOR;
    this.AUTHORID = AUTHORID;
    this.IMAGEURL = IMAGEURL;
    this.LIKES = LIKES;
    this.VIEWS = VIEWS;
    this.LENGTH = LENGTH;
    this.UPLOADDATE = UPLOADDATE;
    this.FILLED = FILLED;
  }
}
