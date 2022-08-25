const {google} = require('googleapis');
const path = require('path');
var playlist = [];
var token = "";
// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyD_iQERUapSJHP-si1SdhtwIYP-bcuzfU0'
});

async function runPlaylist(searchterm) {

  const res = await youtube.playlists.list({
    part: 'contentDetails',
    id: searchterm,
    maxResults: 1,
  });
  if (res.data.pageInfo.totalResults === 0){
    return false;
  } else {
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

// a very simple example of searching for youtube videos
async function runSample(searchterm) {
  if (searchterm.includes('list=')){
    if (searchterm.includes('&index')){
      var playlistID = searchterm.substr(searchterm.indexOf('list=') + 5, (searchterm.indexOf('&index') - searchterm.indexOf('list=') - 5));
      return await runPlaylist(playlistID);
    } else{
      var playlistID = searchterm.substr(searchterm.indexOf('list=') + 5);
      return await runPlaylist(playlistID);
    }
    if (runPlaylist(playlistID) === false){
      return actualPlaylist;
    }
  } else {
    const res = await youtube.search.list({
      part: 'id',
      type: 'video',
      safeSearch: 'strict',
      maxResults: 1,
      q: searchterm,
    });
    if (res.data.pageInfo.totalResults === 0){
      return false;
    } else {
      const actualPlaylist = new playlistThing(await videoInfo(res.data.items[0].id.videoId), false);
      return actualPlaylist;
    }
  }
}

async function videoInfo(searchterm) {

  const res = await youtube.videos.list({
    part: ['snippet, id, contentDetails, statistics'],
    id: searchterm,
  });

  return res;
}

//if (module === require.main) {
  //runSample().catch(console.error);
//}

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
    return res.nextPageToken;
}

module.exports = {
  runSample
}

class playlistThing{
  constructor(PLAYLIST, IFPLAYLIST){
    this.PLAYLIST = PLAYLIST;
    this.IFPLAYLIST = IFPLAYLIST
  }
}

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