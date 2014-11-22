'use strict';

angular.module('blockflojtApp')
  .controller('AdminCtrl', function ($scope, $rootScope, $location) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    $scope.startPartyMode = function() {
        $rootScope.currentHashtag = angular.copy($scope.hashtag);
        $location.path('/');
    };

  });
