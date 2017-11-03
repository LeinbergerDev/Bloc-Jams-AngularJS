(function() {
  function AlbumCtrl(Fixtures) {
    this.albumData = Fixures.getAlbum();
  }

  angular
    .module('blocJams')
    .controller('AlbumCtrl', ['Fixtures', AlbumCtrl]);
})();
