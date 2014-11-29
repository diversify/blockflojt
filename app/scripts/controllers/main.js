'use strict';

angular.module('blockflojtApp')
    .controller('MainCtrl', function ($scope, $rootScope, $http, $q, $timeout, $window) {

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

    angular.element('body').css({'background-color': '#333'});
    angular.element('.footer').css({'position': 'relative'});

    var getPossibleValues = function(theType) {
        var endPoint = 'http://developer.echonest.com/api/v4/artist/list_terms';
        var paramsObj = {
            api_key: 'CEWROMDFMFUUW1QCN',
            type: theType,
            callback: 'JSON_CALLBACK',
            format: 'jsonp'
        };
        return $http.jsonp(endPoint, {params: paramsObj});
    };

    var possibleValues = {
        mood: [],
        style: []
    };
    var setPossibleValues = function() {
        getPossibleValues('mood').then(function(response) {
            var moodObj = response.data.response.terms;
            for (var i in moodObj) {
                possibleValues.mood.push(moodObj[i].name);
            }
        });

        getPossibleValues('style').then(function(response) {
            var styleObj = response.data.response.terms;
            for (var i in styleObj) {
                possibleValues.style.push(styleObj[i].name);
            }
        });
    };

    // Part of greacemokey hack to get current playing song from Spotify webp
    var nowPlaying = function() {
        $scope.artist = decodeURIComponent(localStorage.getItem('artist'));
        $scope.song = decodeURIComponent(localStorage.getItem('song'));
    }

    var init = function(photoIndex) {
        if (!$rootScope.currentHashtag) {$rootScope.currentHashtag = 'happy';}
        getPictures().then(function() {
            console.log('new photo: ',$scope.pictures[$scope.pictures.length-1]);
            var searchParameters,
                hashtagIndex;
            $scope.hashtagArray = [];
            $scope.currentPhoto = $scope.pictures[$scope.pictures.length-1];
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
                findSong(searchParameters);
                //findSong($scope.hashtagArray);
            }
        });
    };

    var getPictures = function() {
        var InstagramClientID = 'f12ed20fcae6402d8ccbd89ed033a905';
        var head = 'https://api.instagram.com/v1/tags/';
        var tail = '/media/recent?client_id=';
        var callbackParam = '&callback=JSON_CALLBACK';
        var requestURL = head + $scope.currentHashtag + tail + InstagramClientID + callbackParam;

        return $http.jsonp(requestURL).
            success(function(data, status, headers, config) {
                    var pic = data.data[0];
                    var picURL = pic.images.standard_resolution.url;
                    var user = pic.user;
                    var tags = pic.tags;

                    $scope.pictures.push({
                        picURL: picURL,
                        user: user,
                        tags: tags
                    });
            }).
            error(function(data, status, headers, config) {
                console.log('Error when fetching images from Instagram', data);
            });
    };

    // This function is really a big mess. It needs to be split into smaller parts.
    var findSong = function(searchParam) {
        var endPoint = 'http://developer.echonest.com/api/v4/song/search';
        var paramsPlaceholder = {
            api_key: 'CEWROMDFMFUUW1QCN',
            results: 1,
            sort: 'song_hotttnesss-desc',
            bucket: ['song_hotttnesss','tracks','id:spotify','audio_summary'],
            callback: 'JSON_CALLBACK',
            format: 'jsonp'
        };
        var searchTypes = ['mood', 'style', 'artist', 'title'];
        var promiseStuff = [];
        for (var k in searchParam) {
            for (var i in searchTypes) {
                if (!possibleValues[searchTypes[i]] || possibleValues[searchTypes[i]].indexOf(searchParam[k]) > -1) {
                    var paramsObj = angular.copy(paramsPlaceholder);
                    paramsObj[searchTypes[i]] = searchParam[k];
                    promiseStuff.push($http.jsonp(endPoint, {params: paramsObj}));
                }
            }
        }
        // the choice of song should be better structured so we don't make
        // a zillion calls to echonest.
        $q.all(promiseStuff).then(function(response) {
            var maxHot = 0;
            for (var j in response) {
                var song = response[j].data.response.songs[0];
                console.log('song: ',song);
                if (song && song.song_hotttnesss > maxHot) {
                    maxHot = song.song_hotttnesss;

                    // The song needs to be avalible on spotify.
                    if (song.tracks.length === 0) {
                        $scope.resultSong = undefined;
                    } else {
                    $scope.resultSong = {
                        title: song.title,
                        artist_name: song.artist_name,
                        duration: song.audio_summary.duration,
                        // I don't know how the exact version should be picked.
                        spotifyURI: song.tracks[0].foreign_id,
                        image: ''
                    };

                    // get the album image from spotify.
                    // should be done in a better way. ex. a promise.
                    var trackID = ($scope.resultSong.spotifyURI).match(/track\:(.*)/)[1];
                    var reqURL = 'https://api.spotify.com/v1/tracks/' + trackID;
                    $http.get(reqURL).
                        success(function(data, status, headers, config) {
                            $scope.resultSong.image = data.album.images[0].url;
                            console.log($scope.resultSong);
                        }).
                        error(function(data, status, headers, config) {
                            console.log(data);
                        });
                    }

                }
            }
            console.log('resultSong: ',$scope.resultSong);
            if ($scope.resultSong === undefined) {
                $scope.currentPhotoIndex++;
                init();
            } else {
                // Play the song in spotify.
                var link = document.createElement('a');
                link.href = $scope.resultSong.spotifyURI;
                link.click();

                // Wait for the duration of the song until update.
                // timeout takes a time in ms while song.duration i seconds
                //
                // the timeout needs to be a bit shorter to account for the
                // time it takes to find a new song. Needs more testing
                $timeout(init, $scope.resultSong.duration * 1000);
            }
        });
    };

    // adds a song to the spotify playlist.
    $scope.addSong = function(uri) {
      // Add a song
      uri = uri ? uri : "spotify:track:2QhURnm7mQDxBb5jWkbDug";

      var me = localStorage.getItem('me');
      var playlistURI = $rootScope.playlist;
      var playlistID = playlistURI.match(/playlist\:(.*)/)[1]
      var reqURL = "https://api.spotify.com/v1/users/" + me + "/playlists/" + playlistID + "/tracks?uris=" + uri;

    $http.post(reqURL, {}).
      success(function(data, status, headers, config) {
          console.log("Success!");
          console.log(data);
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
    }

    init();

  });
