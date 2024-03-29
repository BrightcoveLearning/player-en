/**
 * Still Watching
 */
 videojs.plugin('stillWatching', function() {
  var myPlayer = this,
      currentVideoIndex = 0,
      firstVideo = true,
      msgShown = false,
      options = {
        // elapsed time for checking if viewer is still there (in seconds)
        timeCheckPoint : 5,
        // number of videos played for checking if viewer is still there
        videosCheckPoint : 2,
        // time to allow before stopping video (in seconds)
        timeOut : 5
      },
      // reference in overlay message
      eTimerSpan,
      // counters for time and videos elapsed (short-form) and time checks (long-form)
      totalElapsedTime = 0,
      videosPlayed = 0,
      timeSinceLastCheck = 0,
      timeToNextPoint = options.timeCheckPoint,
      intervalID,
      playlistData = [
        {
        "name":"Great Blue Heron", 
        "sources":[
          {
          "src":"https://support.brightcove.com/test-assets/videos/Great_Blue_Heron.mp4",
          "type":"application/x-mpegURL"
          }]	
        },
        {
        "name":"Oyster Catcher", 
        "sources":[
          {
          "src":"https://support.brightcove.com/test-assets/videos/oystercatcher.mp4",
          "type":"application/x-mpegURL"
          }]
        }
      ],
      playlistLength = playlistData.length;
  
  // utility function logger - check for console to avoid errors in old IE
  var bclsLog = function (context, message) {
    if (window["console"] && console["log"]) {
        console.log(context, message);
    };
  };
    
  // show the message
  var showMessage = function () {
    bclsLog("function", "showMessage");
    var seconds_left = options.timeOut;
    eTimerSpan.innerHTML = seconds_left;
    // show the overlay message
    myPlayer.removeClass("hide-overlay");
    // start the countdown
    intervalID = setInterval(function() {
      seconds_left -= 1;
      eTimerSpan.innerHTML = seconds_left;
      bclsLog("seconds left: ", seconds_left);
      if (seconds_left <= 0)
      {
        // reset the counters
        resetCounters();
        // stop the video
        myPlayer.pause();
        // hide the overlay message
        hideMessage();
      }
    }, 1000);
  };
    
  // hide the message
  var hideMessage = function () {
    bclsLog("function", "hideMessage");
    myPlayer.addClass("hide-overlay");
  };
  
  // reset all counters
  var resetCounters = function () {
    bclsLog("function", "resetCounters");
    clearInterval(intervalID);
    totalElapsedTime = 0;
    videosPlayed = 0;
    timeSinceLastCheck = 0;
    timeToNextPoint = myPlayer.currentTime() + options.timeCheckPoint;
    msgShown = false;
  }
    
  // load a video into the player
  var loadVideo = function() {
    if (currentVideoIndex < playlistLength) {
      // load the new video
      myPlayer.src(playlistData[currentVideoIndex].sources);
      // increment the current video index
      currentVideoIndex++;
      // play the video
      if(firstVideo) {
        firstVideo = false;
      } else {
        myPlayer.play();  
      }
    }
  };
   
  // listen for when the current video finishes playback
  myPlayer.on("ended", function (evt) {
    bclsLog("function", "ended");
    clearInterval(intervalID);
    // load and start playing next video
    loadVideo();

    videosPlayed++;
    totalElapsedTime += myPlayer.duration();
    console.log("totalElapsedTime: ", totalElapsedTime);
    bclsLog("totalElapsedTime", totalElapsedTime);
    if (videosPlayed >= options.videosCheckPoint) {
        showMessage();
    }
  });
    
  // initially hide the overlay message
  myPlayer.addClass("hide-overlay");

  // when the player is loaded, add a click event listener to the overlay
  myPlayer.on("loadedmetadata", function (evt) {
    eTimerSpan = document.getElementById("timerSpan");
    overlayButton.addEventListener("click", function() {  
      resetCounters();
      hideMessage();
    });
  });
    
  // when playback position changes, show the overlay msg if greater than time check point
  myPlayer.on("timeupdate", function (evt) {
    if (myPlayer.currentTime() + totalElapsedTime > timeToNextPoint) {
      if (!msgShown) {
        console.log("startTime ", myPlayer.currentTime());
        showMessage(); 
        msgShown = true;
      } 
    }
  });

  // load the first video
  loadVideo();
  
});