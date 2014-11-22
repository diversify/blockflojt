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
  var redirectURI = 'http://localhost:9000/#/spotify-callback';
  $scope.loginURL = head + clientID + tail + redirectURI;
});
