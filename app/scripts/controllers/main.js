'use strict';

angular.module('blockflojtApp')
    .controller('MainCtrl', function ($scope, $rootScope, $http, $q, $timeout) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.resultSong;
    $scope.pictures = [];
    $scope.currentPhoto;
    $scope.currentPhotoIndex = 0;
    $scope.hashtagArray;

    var init = function(photoIndex) {
        if (!$rootScope.currentHashtag) {$rootScope.currentHashtag = 'happy';}
        $scope.getPictures().then(function() {
            var searchParameters,
                hashtagIndex;
            $scope.hashtagArray = [];
            $scope.currentPhoto = $scope.pictures[$scope.currentPhotoIndex];
            console.log('photo:',$scope.currentPhoto);
            searchParameters;
            $scope.hashtagArray = angular.copy($scope.currentPhoto.tags);
            hashtagIndex = $scope.hashtagArray.indexOf($scope.currentHashtag);
            $scope.hashtagArray.splice(hashtagIndex, 1);
            if ($scope.hashtagArray.length > 0) {
                if ($scope.hashtagArray.length > 3) {
                    searchParameters = $scope.hashtagArray.slice(0, 3);
                } else {
                    searchParameters = angular.copy($scope.hashtagArray);
                }
                $scope.findSong(searchParameters);
            }
        });
        //$timeout(init, 6000);
    };

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
        for (var k in searchParam) {
            console.log('searchParam: '+searchParam[k]);
            for (var i in searchTypes) {
                var paramsObj = angular.copy(paramsPlaceholder);
                paramsObj[searchTypes[i]] = searchParam[k];
                promiseStuff.push($http.jsonp(endPoint, {params: paramsObj}));
            }
        }
        $q.all(promiseStuff).then(function(response) {
            var maxHot = 0;
            for (var j in response) {
                var song = response[j].data.response.songs[0];
                console.log('song: ',song);
                if (song && song.song_hotttnesss > maxHot) {
                    maxHot = song.song_hotttnesss;
                    $scope.resultSong = song;
                }
            }
            console.log('resultSong: ',$scope.resultSong);
            if ($scope.resultSong === undefined) {
                $scope.currentPhotoIndex++;
                init();
            }
        });
    };


    $scope.getPictures = function() {
        var InstagramClientID = '25e0c0b7ab2d47cbb2aad2589664aa93';
        var head = 'https://api.instagram.com/v1/tags/';
        var tail = '/media/recent?client_id=';
        var callbackParam = '&callback=JSON_CALLBACK';
        var requestURL = head + $scope.currentHashtag + tail + InstagramClientID + callbackParam;

        return $http.jsonp(requestURL).
            success(function(data, status, headers, config) {
                //$scope.pictures = [];

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
                console.log('Error when fetching images from Instagram', data);
            });
    };

    init();

        
  });
