'use strict';

angular.module('blockflojtApp')
    .controller('MainCtrl', function ($scope, $http, $q, $routeParams) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    $scope.findSong = function(searchParam) {
        var endPoint = 'http://developer.echonest.com/api/v4/song/search';
        var paramsPlaceholder = {
            api_key: 'CEWROMDFMFUUW1QCN',
            results: 1,
            sort: 'song_hotttnesss-desc',
            bucket: 'song_hotttnesss',
            callback: 'JSON_CALLBACK',
            format: 'jsonp'
        };
        var searchTypes = ['mood', 'artist', 'style'];
        var promiseStuff = [];
        for (var i in searchTypes) {
            var paramsObj = angular.copy(paramsPlaceholder);
            paramsObj[searchTypes[i]] = searchParam;
            promiseStuff.push($http.jsonp(endPoint, {params: paramsObj}));
        }
        $q.all(promiseStuff).then(function(response) {
            var resultSong;
            var maxHot = 0;
            for (var j in response) {
                var song = response[j].data.response.songs[0];
                console.log('song: ',song);
                if (song.song_hotttnesss > maxHot) {
                    maxHot = song.song_hotttnesss;
                    resultSong = song;
                }
            }
            console.log('resultSong: ',resultSong);
        });
    };
    $scope.findSong('happy');


    $scope.data = '';

    $scope.getPictures = function() {
        $scope.data += ' waiting...';
        $http.jsonp(requestURL).
            success(function(data, status, headers, config) {
                $scope.data = '';
                $scope.pictures = [];

                for(var i = 0; i < 20; i++) {
                    var pic = data.data[i];
                    var picURL = pic.images.standard_resolution.url;
                    var user = pic.user;
                    var tags = pic.tags;

                    $scope.pictures.push({
                        picURL: picURL,
                        user: user,
                        tags: tags
                    });
                }
            }).
            error(function(data, status, headers, config) {
                $scope.data = 'Error!';
            });
    };
    var getClientID = function() { return '25e0c0b7ab2d47cbb2aad2589664aa93';};

    var head = 'https://api.instagram.com/v1/tags/';
    var tag = 'diversify';
    var tail = '/media/recent?client_id=';
    var callbackParam = '&callback=JSON_CALLBACK';
    var requestURL = head + tag + tail + getClientID() + callbackParam;
  });
