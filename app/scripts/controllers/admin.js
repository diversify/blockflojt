'use strict';

angular.module('blockflojtApp')
  .controller('AdminCtrl', function ($scope, $rootScope, $location, $http) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.startPartyMode = function() {
        $rootScope.currentHashtag = angular.copy($scope.hashtag);
        $scope.createPlaylist($scope.hashtag);
        $location.path('/');
    };

  var head = 'https://accounts.spotify.com/authorize?client_id=';
  var clientID = '433586e0441c40bbbfba5bc3ee5d55b8';
  var tail = '&response_type=token&redirect_uri=';
  var redirectURI = 'http://localhost:9000/spotify-callback.html';
  var scope = '&scope=playlist-modify-public playlist-modify-private'
  $scope.loginURL = head + clientID + tail + redirectURI + scope;

  if (localStorage.getItem('hash')) {
      var pattern = /access_token=(.*)&token/
      var hash = localStorage.getItem('hash');
      var at = hash.match(pattern)[1];
      localStorage.setItem('at', at);
  }


  $http.defaults.headers.common.Authorization = "Bearer " + localStorage.getItem('at');

  function getMe() {

      var reqURL = "https://api.spotify.com/v1/me";
      $http.get(reqURL).
          success(function(data, status, headers, config) {
            localStorage.setItem('me', data.id);
          }).
          error(function(data, status, headers, config) {
              console.log(data);
          });
  }
  getMe();

  $scope.createPlaylist = function(hashtag) {
      console.log;
      var endpoint = "https://api.spotify.com/v1/users/"
      var reqURL = endpoint + localStorage.getItem('me') + "/playlists";

      function name() {
          var d = new Date();
          return "#" + hashtag + " " + d.toDateString() + " By Blockflöjt"
      }

      // Create the playlist.
    $http.post(reqURL, {name: name(), public: true}).
      success(function(data, status, headers, config) {
          $rootScope.playlist = data.uri;
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
  }

});
