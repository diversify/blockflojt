'use strict';

angular.module('blockflojtApp')
  .directive('aboutDirective', function () {
    return {
      template: '<div class="footer">'+
                    '<div id="about-section" class="container-fluid">' +
                        '<h2 class="text-center">About</h2>'+
                        '<p class="text-center">Quepic is the result of 24 hours of hacking at Diversity, a hackathon held at Spotify HQ</p>'+
                        '<div class="col-xs-3 img-wrapper"><img class="col-xs-12" src="images/jakob.png"><p class="col-xs-12 text-center name">Jakob Larsson</p></div>' +
                        '<div class="col-xs-3 img-wrapper"><img class="col-xs-12" src="images/jaokim.png"><p class="col-xs-12 text-center name">Joakim Ljunggren</p></div>' +
                        '<div class="col-xs-3 img-wrapper"><img class="col-xs-12" src="images/sandra.png"><p class="col-xs-12 text-center name">Sandra Liljeqvist</p></div>' +
                        '<div class="col-xs-3 img-wrapper"><img class="col-xs-12" src="images/unn.png"><p class="col-xs-12 text-center name">Unn Swanström</p></div>' +
                    '</div>'+
                    '<div class="navbar">'+
                        '<ul class="nav col-xs-offset-4 col-xs-4">'+
                            '<li class="col-xs-4"><a ng-click="openAbout()">About</a></li>'+
                            '<li class="col-xs-4"><img src="images/logo2.png" class="pull-right"></li>'+
                            '<li class="col-xs-4"><a href="#/admin">Admin</a></li>'+
                        '</ul>'+
                    '</div>'+
                '</div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.aboutOpen = false;
        element.find('#about-section').css('max-height', '0px');
        scope.openAbout = function() {
            console.log('openAbout');
            if (scope.aboutOpen === true) {
                element.find('#about-section').css('max-height', '0px');
            } else {
                element.find('#about-section').css('max-height', '500px');
            }
            scope.aboutOpen = !scope.aboutOpen;
        };


      }
    };
  });
