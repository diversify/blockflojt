'use strict';

/**
 * @ngdoc function
 * @name blockflojtApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the blockflojtApp
 */
angular.module('blockflojtApp')
  .controller('AdminCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  var head = 'https://accounts.spotify.com/authorize?client_id=';
  var clientID = '433586e0441c40bbbfba5bc3ee5d55b8';
  var tail = '&response_type=token&redirect_uri=';
  var redirectURI = 'http://localhost:9000/spotify-callback.html';
  $scope.loginURL = head + clientID + tail + redirectURI;

  console.log("men kom igen");
  if (localStorage.getItem('hash')) {
      var pattern = /access_token=(.*)&token/
      var hash = localStorage.getItem('hash');
      var at = hash.match(pattern)[1];
      localStorage.setItem('at', at);
  }

  $scope.createPlaylist() {
  }
});
