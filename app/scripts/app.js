'use strict';

/**
 * @ngdoc overview
 * @name blockflojtApp
 * @description
 * # blockflojtApp
 *
 * Main module of the application.
 */
angular
  .module('blockflojtApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/spotify-callback', {
        templateUrl: 'views/spotify-callback.html',
        controller: 'SpotifyCallback'
      })
      .otherwise({
        redirectTo: '/'
      });

      //$locationProvider.html5Mode(true);
  });
