(function() {
  function SongPlayer() {
    /**
    * @desc SongPlayer object
    * @type {Object} SongPlayer
    */
    var SongPlayer = {};

    /**
    * @desc the selected song.
    * @type {Object} currentSong
    */
    var currentSong = null;

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function playSong
    * @desc SongPlayer object
    */
    var playSong = function() {
      currentBuzzObject.play();
      song.playing = true;
    }

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        playSong();
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });
      currentSong = song;
    };

    /**
    * @desc public method to play selected song
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      if (currentSong !== song){
        setSong(song);
        playSong();
      }
    };

    /**
    * @desc public method to pause selected song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    }

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
