'use strict';

angular.module('blockflojtApp')
	.controller('MainCtrl', function ($scope, $http, $q) {

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

});
