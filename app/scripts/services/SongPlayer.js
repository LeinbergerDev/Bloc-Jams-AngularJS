(function() {
  function SongPlayer($rootScope, Fixtures) {
    /**
    * @desc SongPlayer object
    * @type {Object} SongPlayer
    */
    var SongPlayer = {};

    /**
    *@desc current album object
    * @type {object} currentAlbum
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;


    /**
    * @function playSong
    * @desc SongPlayer object
    */
    var playSong = function(song) {
      if (song === null) {
        alert("song object is null");
      }
      currentBuzzObject.play();

      /*song.playing = true;*/
      song.isPlaying = true;
    }

    var stopSong = function(song) {
      /*song.playing = false;*/
      song.isPlaying = false;
      currentBuzzObject.stop();
    }

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        stopSong(song);
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true,
        autoplay: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function () {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };

    /**
    * @desc private method to get index of a song on the album.
    * @return index of song.
    */
    var getSongIndex = function(song){
      return currentAlbum.songs.indexOf(song);
    }

    /**
    * @desc the selected song.
    * @type {Object} currentSong
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {number}
    */
    SongPlayer.currentTime = null;

    /**
    * @desc Stores the time when the current song is paused
    * @type {number}
    */
    SongPlayer.pausedTime = null;

    SongPlayer.isPaused = false;
    /**
    * @desc Current volume setting
    * @type {number}
    */
    SongPlayer.volume = null;

    SongPlayer.muted = null;

    /**
    * @desc public method to play selected song
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      if (song == null) {
        if (SongPlayer.currentSong == null) {
          if (currentAlbum == null) { return;}
          SongPlayer.currentSong = currentAlbum.songs[0];
        }
        SongPlayer.currentSong.isPlaying = true;
        setSong(SongPlayer.currentSong);
        playSong(SongPlayer.currentSong);
        console.log("SongPlayer.isPaused: " + SongPlayer.isPaused);
        if (SongPlayer.isPaused === true){
          console.log("song was paused");
          SongPlayer.setCurrentTime(SongPlayer.pausedTime);
          SongPlayer.isPaused = false;
        }
      } else {
        if (SongPlayer.currentSong !== null) {
          SongPlayer.currentSong.isPlaying = false;
        }
        song = song || SongPlayer.currentSong;
        if (SongPlayer.currentSong !== song){
          SongPlayer.currentSong = song;
          setSong(song);
          playSong(song);
        } else {
          setSong(SongPlayer.currentSong);
          playSong(SongPlayer.currentSong);
          if (SongPlayer.isPaused === true){
            console.log("song was paused");
            SongPlayer.setCurrentTime(SongPlayer.pausedTime);
            SongPlayer.isPaused = false;
          }
        }
      }
    };

    /**
    * @desc public method to test if the song has ended.  signals to run the next song
    */

    SongPlayer.isEnded = function () {
      if (currentBuzzObject){
        if(currentBuzzObject.isEnded()) {
          SongPlayer.next();
          if (SongPlayer.muted) {
            SongPlayer.mute();
          }
        }
      }
    };

    /**
    * @desc  public method to mute the sound.
    */
    SongPlayer.mute = function () {
      if (currentBuzzObject) {
        currentBuzzObject.mute();
        SongPlayer.muted = true;
      }
    };

    /**
    * @desc public method to unmute the sound.
    */
    SongPlayer.unmute = function() {
      if (currentBuzzObject) {
        SongPlayer.muted = false;
        currentBuzzObject.unmute();
      }
    }

    /**
    * @desc public method to pause selected song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      console.log("pause clicked");
      song = song || SongPlayer.currentSong;
      SongPlayer.pausedTime = currentBuzzObject.getTime();
      console.log(SongPlayer.pausedTime);
      currentBuzzObject.pause();
      SongPlayer.isPaused = true;
      song.playing = false;
      song.isPlaying = false;
    }

    /**
    * @desc public method to move to the previous song
    */
    SongPlayer.previous = function() {
      if (SongPlayer.currentSong !== null) {
        SongPlayer.currentSong.isPlaying = false;
      }
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;
      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.isPlaying = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    }

    SongPlayer.next = function() {
      if (SongPlayer.currentSong !== null) {
        SongPlayer.currentSong.isPlaying = false;
      }
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;
      console.log("Song Index: " + currentSongIndex + " Songs: " + currentAlbum.songs.length);
      if (currentSongIndex > currentAlbum.songs.length - 1) {
        console.log("Song Index: " + currentSongIndex + " Songs: " + currentAlbum.songs.length);
        currentBuzzObject.stop();
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    }

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    /**
    * @function setVolume
    * @desc Set the current volume
    * @param {number} volume
    */
    SongPlayer.setVolume = function(volume) {
      currentBuzzObject.setVolume(volume);
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
