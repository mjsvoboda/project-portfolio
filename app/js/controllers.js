'use strict';

/* Controllers */

var ppAppControllers = angular.module('ppAppControllers', []);

ppAppControllers.controller('ProjectListCtrl', ['$scope', '$http', '$log', 
	function($scope, $http, $log) {
		$http.get('projects/projects.json').success(function(data) {
			$scope.projects = data;

			$scope.currentPage = 1;
			$scope.numPerPage = 15;
			$scope.totalItems = data.length;
			
			$scope.$watch("currentPage", function() {
				//var begin = (($scope.currentPage - 1) * $scope.numPerPage);
	        	//var end = begin + $scope.numPerPage;

				//$scope.filteredProjects = $scope.projects.slice(begin, end);
				$scope.begin =  (($scope.currentPage - 1) * $scope.numPerPage);
			});
			
			$scope.pageChanged = function() {
				$log.log('Page changed to: ' + $scope.currentPage);
			};
		});
	}]);

ppAppControllers.controller('ProjectDetailCtrl', ['$scope', '$stateParams', '$http', 'projectService', 
  function($scope, $stateParams, $http, projectService) {
    //$http.get('projects/' + $stateParams.id + '.json').success(function(data) {
	//  $scope.project = data;
	//});
	$scope.data = projectService.get({id: $stateParams.id}, function (){
		console.log($scope.data);
		$scope.project = $scope.data;
	});
	
	$scope.save = function() {
		$scope.data.$update(function () {
			console.log('update');
		});
		//projectService.save($scope.project, function () {
		//	console.log('saved');
		//});
	};
    
  }]);




ppAppControllers.controller('NavigationCtrl', ['$scope', '$location', '$state',
	function ($scope, $location, $state) {
		$scope.getClass = function (path) {
			if ($location.path().indexOf(path) > 0) {
				return 'active';
			} else {
				return '';
			}
		}
	}]);

ppAppControllers.controller('PaginationDemoCtrl', function ($scope, $log) {
	  $scope.totalItems = 400;
	  //$scope.currentPage = 4;
	  $scope.currentPage = $scope.mypage;
	  
	  $scope.setPage = function (pageNo) {
		  
	    //$scope.currentPage = pageNo;
		  $scope.currentPage = mypage;
	  };

	  $scope.pageChanged = function() {
		  $scope.setLimit ($scope.currentPage);
	    $log.log('Page changed to: ' + $scope.currentPage);
	  };

	});