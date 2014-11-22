'use strict';

/**
 * @ngdoc function
 * @name blockflojtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blockflojtApp
 */
angular.module('blockflojtApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.data = "hej";

    $scope.getPictures = function() {
        $scope.data += " waiting...";
        $http.jsonp(requestURL).
            success(function(data, status, headers, config) {
                $scope.pictures = [];

                for(var i = 0; i < 20; i++) {
                    var s = data.data[i].images.standard_resolution.url;
                    $scope.pictures.push(s);
                }
            }).
            error(function(data, status, headers, config) {
                $scope.data = "Error!";
            });
    }
    var getClientID = function() { return "25e0c0b7ab2d47cbb2aad2589664aa93";}

    var head = "https://api.instagram.com/v1/tags/"
    var tag = "diversify";
    var tail = "/media/recent?client_id="
    var callbackParam = "&callback=JSON_CALLBACK"
    var requestURL = head + tag + tail + getClientID() + callbackParam;
  });
