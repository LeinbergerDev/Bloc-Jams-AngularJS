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
      currentBuzzObject.play();
      song.playing = true;
    }

    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = false;
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
        preload: true
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
    * @desc Current volume setting
    * @type {number}
    */
    SongPlayer.volume = null;

    /**
    * @desc public method to play selected song
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song){
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @desc public method to pause selected song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    }

    /**
    * @desc public method to move to the previous song
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;
      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    }

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;
      if (currentSongIndex > currentAlbum.songs.length) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
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
      console.log(volume)
      currentBuzzObject.setVolume(volume);
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
