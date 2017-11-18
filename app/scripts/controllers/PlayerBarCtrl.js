(function() {
  function PlayerBarCtrl(Fixtures, SongPlayer) {

    this.albumData = Fixtures.getAlbum();
    this.songPlayer = SongPlayer;


    this.mute = function (){
      this.SongPlayer.muted = true;
      this.SongPlayer.mute();
    };

    this.unMute = function () {
      this.SongPlayer.muted = false;
      this.SongPlayer.unmute();
    }
  }

  angular
    .module('blocJams')
    .controller('PlayerBarCtrl', ['Fixtures', 'SongPlayer', PlayerBarCtrl]);
})();
