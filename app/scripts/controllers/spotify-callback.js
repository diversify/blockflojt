'use strict';

/**
 * @ngdoc function
 * @name blockflojtApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the blockflojtApp
 */
angular.module('blockflojtApp')
  .controller('SpotifyCallback', function ($scope, $routeParams) {
      $scope.data = $routeParams.access_token;
      $scope.data += "    " + $routeParams.expires_in
});
